const asyncButton = document.querySelector("#run-async");
const asyncLog = document.querySelector("#async-log");
const parkForm = document.querySelector("#park-search");
const parkStatus = document.querySelector("#park-status");
const parkList = document.querySelector("#park-list");
const noteForm = document.querySelector("#note-form");
const notePark = document.querySelector("#note-park");
const noteStatus = document.querySelector("#note-status");
const noteList = document.querySelector("#note-list");
const reloadNotesButton = document.querySelector("#reload-notes");

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function addTrace(message) {
  const item = document.createElement("li");
  item.textContent = message;
  asyncLog.appendChild(item);
}

async function runAsyncTrace() {
  asyncLog.replaceChildren();
  addTrace("1 · synchronous start");

  setTimeout(() => addTrace("4 · timer task"), 0);
  Promise.resolve().then(() => addTrace("3 · Promise microtask"));

  addTrace("2 · synchronous end");
  await delay(30);
  addTrace("5 · continuation after await");
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const responseText = await response.text();
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = responseText && isJson ? JSON.parse(responseText) : responseText || null;

  if (!response.ok) {
    const error = new Error(body?.title ?? `HTTP ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

function setBusy(form, busy) {
  for (const element of form.elements) element.disabled = busy;
}

function renderParks(parks) {
  parkList.replaceChildren();

  for (const park of parks) {
    const card = document.createElement("article");
    card.className = "card";

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = park.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = park.fullName;
    heading.appendChild(link);

    const code = document.createElement("p");
    code.className = "park-code";
    code.textContent = `${park.parkCode.toUpperCase()} · ${park.states}`;

    const description = document.createElement("p");
    description.textContent = park.description || "ไม่มีคำอธิบาย";

    card.append(heading, code, description);
    parkList.appendChild(card);
  }
}

function updateParkOptions(parks) {
  notePark.replaceChildren();

  for (const park of parks) {
    const option = document.createElement("option");
    option.value = park.parkCode;
    option.dataset.name = park.fullName;
    option.textContent = park.fullName;
    notePark.appendChild(option);
  }
}

async function loadParks(event) {
  event?.preventDefault();
  const stateCode = document.querySelector("#state-code").value.trim().toUpperCase();
  const limit = document.querySelector("#park-limit").value;
  const search = new URLSearchParams({ stateCode, limit });

  setBusy(parkForm, true);
  parkStatus.textContent = "loading · Promise pending";
  parkList.replaceChildren();

  try {
    const result = await requestJson(`/api/parks?${search}`);
    if (result.data.length === 0) {
      parkStatus.textContent = "success · empty data";
      return;
    }
    renderParks(result.data);
    updateParkOptions(result.data);
    parkStatus.textContent = `success · ${result.data.length} parks · ${result.meta.source}`;
  } catch (error) {
    parkStatus.textContent = `error · ${error.status ?? "network"} · ${error.message}`;
  } finally {
    setBusy(parkForm, false);
  }
}

function renderNotes(notes) {
  noteList.replaceChildren();

  if (notes.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "ยังไม่มี reading note";
    noteList.appendChild(empty);
    return;
  }

  for (const note of notes) {
    const item = document.createElement("li");
    item.className = "note";
    item.dataset.id = note.id;

    const content = document.createElement("div");
    const heading = document.createElement("strong");
    heading.textContent = note.parkName;
    const text = document.createElement("p");
    text.textContent = note.text;
    content.append(heading, text);

    const actions = document.createElement("div");
    actions.className = "actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.textContent = "PATCH";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.className = "danger";
    deleteButton.textContent = "DELETE";
    actions.append(editButton, deleteButton);

    item.append(content, actions);
    noteList.appendChild(item);
  }
}

async function loadNotes() {
  noteStatus.textContent = "loading notes…";

  try {
    const notes = await requestJson("/api/notes");
    renderNotes(notes);
    noteStatus.textContent = `success · ${notes.length} notes`;
  } catch (error) {
    noteStatus.textContent = `error · ${error.status ?? "network"} · ${error.message}`;
  }
}

async function createNote(event) {
  event.preventDefault();
  const selected = notePark.selectedOptions[0];
  const body = {
    parkCode: selected.value,
    parkName: selected.dataset.name,
    text: document.querySelector("#note-text").value.trim(),
  };

  setBusy(noteForm, true);
  noteStatus.textContent = "POST pending…";

  try {
    const created = await requestJson("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    noteForm.reset();
    noteStatus.textContent = `created · 201 · ${created.id}`;
    await loadNotes();
  } catch (error) {
    noteStatus.textContent = `error · ${error.status ?? "network"} · ${error.message}`;
  } finally {
    setBusy(noteForm, false);
  }
}

async function updateNote(noteId, currentText) {
  const text = window.prompt("แก้ไข reading note", currentText)?.trim();
  if (!text) return;

  const updated = await requestJson(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  noteStatus.textContent = `updated · 200 · ${updated.id}`;
  await loadNotes();
}

async function deleteNote(noteId) {
  await requestJson(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: "DELETE",
  });
  noteStatus.textContent = "deleted · 204 · no response body";
  await loadNotes();
}

async function handleNoteAction(event) {
  const button = event.target.closest("button[data-action]");
  const item = button?.closest("[data-id]");
  if (!button || !item) return;

  button.disabled = true;
  try {
    if (button.dataset.action === "edit") {
      await updateNote(item.dataset.id, item.querySelector("p").textContent);
    } else if (
      button.dataset.action === "delete" &&
      window.confirm("ลบ note นี้หรือไม่")
    ) {
      await deleteNote(item.dataset.id);
    }
  } catch (error) {
    noteStatus.textContent = `error · ${error.status ?? "network"} · ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

asyncButton.addEventListener("click", runAsyncTrace);
parkForm.addEventListener("submit", loadParks);
noteForm.addEventListener("submit", createNote);
noteList.addEventListener("click", handleNoteAction);
reloadNotesButton.addEventListener("click", loadNotes);

loadNotes();
