import assert from "node:assert/strict";

const baseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:3000";

async function requestJson(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
}

const health = await requestJson("/health");
assert.equal(health.response.status, 200);
assert.equal(health.body.status, "ok");

const listBefore = await requestJson("/api/notes");
assert.equal(listBefore.response.status, 200);
assert.ok(Array.isArray(listBefore.body));

const created = await requestJson("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    parkCode: "test",
    parkName: "Smoke Test Park",
    text: "created by the automated smoke test",
  }),
});
assert.equal(created.response.status, 201);
assert.ok(created.body.id);

const noteId = encodeURIComponent(created.body.id);
const updated = await requestJson(`/api/notes/${noteId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "updated by the automated smoke test" }),
});
assert.equal(updated.response.status, 200);
assert.equal(updated.body.text, "updated by the automated smoke test");

const detail = await requestJson(`/api/notes/${noteId}`);
assert.equal(detail.response.status, 200);
assert.equal(detail.body.id, created.body.id);

const removed = await fetch(`${baseUrl}/api/notes/${noteId}`, {
  method: "DELETE",
});
assert.equal(removed.status, 204);

const missing = await requestJson(`/api/notes/${noteId}`);
assert.equal(missing.response.status, 404);

const simulatedError = await requestJson("/api/demo/status/500");
assert.equal(simulatedError.response.status, 500);
assert.equal(simulatedError.body.status, 500);

const delayed = await requestJson("/api/demo/delay?ms=5");
assert.equal(delayed.response.status, 200);
assert.equal(delayed.body.waitedMilliseconds, 5);

console.log("Smoke test passed: health + notes CRUD + failure/cancellation endpoints");

if (process.env.TEST_NPS === "true") {
  const parks = await requestJson("/api/parks?stateCode=CA&limit=1");
  assert.equal(parks.response.status, 200);
  assert.equal(parks.body.data.length, 1);
  console.log(`NPS check passed: source=${parks.body.meta.source}`);
} else {
  console.log("NPS check skipped; run with TEST_NPS=true to include it");
}
