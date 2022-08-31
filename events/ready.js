import deployCommands from "../utils/deploy-commands.js";
import chalk from "chalk";
import check from "../utils/check-modules-version.js";
import client from "../client.js";

/** @type {import("../typings/index.js").Event<"ready">} */
export default {
	name: "ready",
	once: true,
	execute: async () => {
		log(`${client.user.username}#${client.user.discriminator} is ready!`, {
			padding: 1,
			borderStyle: "round",
			title: chalk.hex("#9a8cff")`Tavuk Döner#7528`,
			titleAlignment: "center",
			borderColor: "#9a8cff",
		});

		await deployCommands();
		await check().then((arr) =>
			arr.forEach(({ name, currentVersion, newVersion }) =>
				update(
					`New version of ${name} is available!`,
					currentVersion,
					newVersion
				)
			)
		);
	},
};
