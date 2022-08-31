import client from "../client.js";
import { codeBlock } from "@discordjs/builders";
import _ from "lodash";
import { CommandInteraction } from "eris";

const { LOG_CHANNEL, AUTHOR_ID } = process.env;

/** @type {import("../typings").Event<"interactionCreate">} */
export default {
	name: "interactionCreate",
	execute: async (interaction) => {
		if (interaction instanceof CommandInteraction) {
			const {
				data: { name, options: args = [] },
				user,
			} = interaction;

			const command = client.commands.get(name);

			if (command.ownerOnly && AUTHOR_ID && user.id !== AUTHOR_ID)
				return interaction.createMessage({
					ephemeral: true,
					content: "Bu komuta erişimin izniniz yok!",
				});

			try {
				await command.execute({ interaction, args, client });
			} catch (err) {
				console.error(err);
				LOG_CHANNEL &&
					client.createMessage(
						LOG_CHANNEL,
						codeBlock("xl", (err.stack || err.message).substring(0, 3900))
					);
			}
		}
	},
};
