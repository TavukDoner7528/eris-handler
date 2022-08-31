import { readdirSync } from "node:fs";
import client from "../client.js";

export default async () => {
	const eventFiles = readdirSync("events").filter((file) =>
		file.endsWith(".js")
	);

	for (const file of eventFiles) {
		const event = await import(`../events/${file}`).then(
			(module) => module.default
		);
		if (event.once) {
			client.once(event.name, event.execute);
		} else {
			client.on(event.name, event.execute);
		}
	}
};
