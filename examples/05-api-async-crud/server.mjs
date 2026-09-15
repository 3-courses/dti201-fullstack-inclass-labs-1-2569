import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const publicDirectory = resolve(appRoot, "public");
const dataDirectory = resolve(appRoot, "data");
const notesPath = resolve(dataDirectory, "notes.json");
const notesSeedPath = resolve(dataDirectory, "notes.seed.json");
const offlineParksPath = resolve(dataDirectory, "nps-parks.sample.json");
const port = Number(process.env.PORT ?? 3000);
const offlineMode = process.argv.includes("--offline") || process.env.NPS_OFFLINE === "true";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function sendJson(response, status, body, extraHeaders = {}) {
  response.writeHead(status, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  response.end(JSON.stringify(body, null, 2));
}

function sendEmpty(response, status) {
  response.writeHead(status, corsHeaders);
  response.end();
}

async function ensureNotesFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(notesPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await copyFile(notesSeedPath, notesPath);
  }
}

async function readNotes() {
  await ensureNotesFile();
  return JSON.parse(await readFile(notesPath, "utf8"));
}

let pendingWrite = Promise.resolve();

function changeNotes(change) {
  const result = pendingWrite.then(async () => {
    const notes = await readNotes();
    const value = change(notes);
    await writeFile(notesPath, `${JSON.stringify(notes, null, 2)}\n`, "utf8");
    return value;
  });

  pendingWrite = result.catch(() => undefined);
  return result;
}

async function readJsonBody(request) {
  let rawBody = "";

  for await (const chunk of request) {
    rawBody += chunk;
    if (rawBody.length > 100_000) {
      throw new HttpError(413, "Request body is too large");
    }
  }

  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new HttpError(400, "Request body must be valid JSON");
  }
}

function validateNewNote(body) {
  const note = {
    parkCode: String(body.parkCode ?? "").trim().toLowerCase(),
    parkName: String(body.parkName ?? "").trim(),
    text: String(body.text ?? "").trim(),
  };
  const errors = {};

  if (!/^[a-z0-9]{4,10}$/.test(note.parkCode)) {
    errors.parkCode = ["parkCode must contain 4-10 letters or numbers"];
  }
  if (note.parkName.length < 3) {
    errors.parkName = ["parkName must contain at least 3 characters"];
  }
  if (note.text.length < 10) {
    errors.text = ["text must contain at least 10 characters"];
  }

  if (Object.keys(errors).length > 0) {
    throw new HttpError(422, "Validation failed", errors);
  }

  return note;
}

async function getParks(requestUrl) {
  const stateCode = (requestUrl.searchParams.get("stateCode") ?? "CA").toUpperCase();
  const requestedLimit = Number(requestUrl.searchParams.get("limit") ?? 6);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 20)
    : 6;

  if (!/^[A-Z]{2}$/.test(stateCode)) {
    throw new HttpError(400, "stateCode must be a two-letter US state code");
  }

  if (offlineMode) {
    const sample = JSON.parse(await readFile(offlineParksPath, "utf8"));
    const data = sample.data
      .filter((park) => park.states.split(",").includes(stateCode))
      .slice(0, limit);
    return {
      total: String(data.length),
      data,
      meta: { source: "offline-sample", stateCode, rateLimitRemaining: null },
    };
  }

  if (!process.env.NPS_API_KEY) {
    throw new HttpError(
      503,
      "NPS_API_KEY is not configured. Copy .env.example to .env, or use npm run start:offline.",
    );
  }

  const npsUrl = new URL("https://developer.nps.gov/api/v1/parks");
  npsUrl.searchParams.set("stateCode", stateCode);
  npsUrl.searchParams.set("limit", String(limit));

  let upstream;
  try {
    upstream = await fetch(npsUrl, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": process.env.NPS_API_KEY,
      },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new HttpError(502, "NPS API could not be reached", {
      cause: error.cause?.code ?? error.name,
      recovery: "Check the network/certificate, or run npm run start:offline.",
    });
  }

  const responseText = await upstream.text();
  let payload;
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new HttpError(502, "NPS API returned a non-JSON response");
  }

  if (!upstream.ok) {
    throw new HttpError(upstream.status, payload.error?.message ?? "NPS API request failed");
  }

  return {
    total: String(payload.total ?? payload.data?.length ?? 0),
    data: (payload.data ?? []).map((park) => ({
      id: park.id,
      parkCode: park.parkCode,
      fullName: park.fullName,
      url: park.url,
      description: park.description,
      states: park.states,
    })),
    meta: {
      source: "nps-live",
      stateCode,
      rateLimitRemaining: upstream.headers.get("x-ratelimit-remaining"),
    },
  };
}

async function handleApi(request, response, requestUrl) {
  const { method = "GET" } = request;
  const { pathname } = requestUrl;

  if (method === "OPTIONS") {
    sendEmpty(response, 204);
    return true;
  }

  if (method === "GET" && pathname === "/health") {
    sendJson(response, 200, {
      status: "ok",
      service: "dti201-api-lab",
      npsMode: offlineMode ? "offline" : "live",
    });
    return true;
  }

  if (method === "GET" && pathname === "/api/parks") {
    sendJson(response, 200, await getParks(requestUrl));
    return true;
  }

  if (method === "GET" && pathname === "/api/demo/delay") {
    const requestedDelay = Number(requestUrl.searchParams.get("ms") ?? 2_000);
    const milliseconds = Number.isFinite(requestedDelay)
      ? Math.min(Math.max(requestedDelay, 0), 5_000)
      : 2_000;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
    sendJson(response, 200, { status: "ok", waitedMilliseconds: milliseconds });
    return true;
  }

  const simulatedStatusMatch = pathname.match(/^\/api\/demo\/status\/(\d{3})$/);
  if (method === "GET" && simulatedStatusMatch) {
    const status = Number(simulatedStatusMatch[1]);
    const allowedStatuses = new Set([400, 401, 403, 404, 409, 422, 429, 500]);
    if (!allowedStatuses.has(status)) {
      throw new HttpError(400, "Choose a documented demo status");
    }
    throw new HttpError(status, `Simulated HTTP ${status} for the Chapter 4 lab`);
  }

  if (pathname === "/api/notes" && method === "GET") {
    const parkCode = requestUrl.searchParams.get("parkCode")?.toLowerCase();
    const notes = await readNotes();
    sendJson(
      response,
      200,
      parkCode ? notes.filter((note) => note.parkCode === parkCode) : notes,
    );
    return true;
  }

  if (pathname === "/api/notes" && method === "POST") {
    const values = validateNewNote(await readJsonBody(request));
    const timestamp = new Date().toISOString();
    const created = {
      id: randomUUID(),
      ...values,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await changeNotes((notes) => notes.push(created));
    sendJson(response, 201, created, { Location: `/api/notes/${created.id}` });
    return true;
  }

  const detailMatch = pathname.match(/^\/api\/notes\/([^/]+)$/);
  if (!detailMatch) return false;

  const noteId = decodeURIComponent(detailMatch[1]);

  if (method === "GET") {
    const note = (await readNotes()).find((item) => item.id === noteId);
    if (!note) throw new HttpError(404, "Reading note not found");
    sendJson(response, 200, note);
    return true;
  }

  if (method === "PATCH") {
    const body = await readJsonBody(request);
    const text = String(body.text ?? "").trim();
    if (text.length < 10) {
      throw new HttpError(422, "Validation failed", {
        text: ["text must contain at least 10 characters"],
      });
    }

    const updated = await changeNotes((notes) => {
      const note = notes.find((item) => item.id === noteId);
      if (!note) throw new HttpError(404, "Reading note not found");
      note.text = text;
      note.updatedAt = new Date().toISOString();
      return note;
    });
    sendJson(response, 200, updated);
    return true;
  }

  if (method === "DELETE") {
    await changeNotes((notes) => {
      const index = notes.findIndex((item) => item.id === noteId);
      if (index === -1) throw new HttpError(404, "Reading note not found");
      notes.splice(index, 1);
    });
    sendEmpty(response, 204);
    return true;
  }

  throw new HttpError(405, `Method ${method} is not allowed for ${pathname}`);
}

async function serveStatic(response, pathname) {
  const relativePath = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
  const filePath = resolve(publicDirectory, relativePath);

  if (filePath !== publicDirectory && !filePath.startsWith(`${publicDirectory}${sep}`)) {
    throw new HttpError(403, "Forbidden");
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    });
    response.end(content);
  } catch (error) {
    if (error.code !== "ENOENT" && error.code !== "EISDIR") throw error;
    throw new HttpError(404, "File not found");
  }
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);

  try {
    const handled = await handleApi(request, response, requestUrl);
    if (handled) return;

    if (requestUrl.pathname.startsWith("/api/")) {
      throw new HttpError(404, "API endpoint not found");
    }
    if (request.method !== "GET") {
      throw new HttpError(405, `Method ${request.method} is not allowed`);
    }

    await serveStatic(response, requestUrl.pathname);
  } catch (error) {
    const status = error.status ?? 500;
    sendJson(response, status, {
      type: status >= 500 ? "server-error" : "request-error",
      title: error.message ?? "Unexpected server error",
      status,
      ...(error.details ? { errors: error.details } : {}),
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`DTI201 API lab: http://127.0.0.1:${port}`);
  console.log(`NPS mode: ${offlineMode ? "offline sample" : "live API"}`);
});
