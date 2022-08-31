import "dotenv/config";
import { Collection } from "@discordjs/collection";
import client from "./client.js";
import logs from "./utils/log.js";

Object.assign(global, logs);

client.commands = new Collection()

/* Command handler */
await import("./handlers/commands.js").then(
	async (module) => await module.default()
);

/* Event handler */
await import("./handlers/events.js").then(
	async (module) => await module.default()
);

client.connect();
