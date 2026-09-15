import { copyFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const stateUrl = new URL("../data/notes.json", import.meta.url);
const seedUrl = new URL("../data/notes.seed.json", import.meta.url);

await rm(fileURLToPath(stateUrl), { force: true });
await copyFile(fileURLToPath(seedUrl), fileURLToPath(stateUrl));

console.log("Reset data/notes.json from notes.seed.json");
