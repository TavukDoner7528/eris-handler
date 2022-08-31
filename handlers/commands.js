import { readdirSync } from "node:fs";
import client from "../client.js";
import AsciiTable from "ascii-table";

export default async () => {
	const commandFiles = readdirSync("commands").filter((file) =>
		file.endsWith(".js")
	);
	const table = new AsciiTable("Commands Loaded");
	table
		.setBorder("│", "─", ".", "'")
		.setHeading("Name", "Status")
		.setAlign(0, AsciiTable.CENTER);

	for (const file of commandFiles) {
		const command = await import(`../commands/${file}`).then(
			(module) => module.default
		);
		if (typeof command == "object" && command.name) {
			client.commands.set(command.name, command);
			table.addRow(command.name, "Loaded");
		} else {
			table.addRow(
				file.substring(0, file.lastIndexOf(".")),
				"Error! Name not found"
			);
		}
	}
	console.log(table.render());
};
