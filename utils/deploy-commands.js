import client from "../client.js";
import formatCommands from "./format-commands.js";
import { Constants } from "eris";
import { getBorderCharacters, createStream } from "table";
import _ from "lodash";

const { ApplicationCommandOptionTypes } = Constants;

export default async () => {
	log("Deploying commands...");
	const config = {
		border: getBorderCharacters("norc"),
		columnDefault: {
			width: 10,
		},
		columns: [{ alignment: "center" }, { alignment: "center" }],
		columnCount: 2,
	};
	const stream = createStream(config);

	const currentCommands = await client.getCommands();
	/**
	 * @type {import("../typings").CommandsCollection}
	 */
	const commands = client.commands;

	const newCommands = commands.filter(
		(command) => !currentCommands.some((c) => c.name === command.name)
	);
	for (const [key, newCommand] of newCommands) {
		await client.createCommand(formatCommands(newCommand));
	}
	if (newCommands.size) stream.write(["Created", newCommands.size]);

	const deletedCommands = currentCommands.filter(
		(command) => !commands.some((c) => c.name === command.name)
	);
	for (const deletedCommand of deletedCommands) {
		await client.deleteCommand(deletedCommand.application_id);
	}
	if (deletedCommands.length)
		stream.write(["Deleted", deletedCommands.length]);

	const updatedCommands = commands.filter((command) => {
		const previousCommand = currentCommands.find(
			(c) => c.name === command.name
		);
		return (
			currentCommands.some((c) => c.name === command.name) &&
			(!optionsEqual(previousCommand.options ?? [], command.options ?? []) ||
				!_.isEqual(
					_.pickBy(
						formatCommands(command),
						(value, key) => key !== "options"
					),
					_.pickBy(
						formatCommands(previousCommand),
						(value, key) => key !== "options"
					)
				))
		);
	});

	for (const newCommand of updatedCommands.toJSON()) {
		const id = currentCommands.find((c) => c.name === newCommand.name).id;
		await client.editCommand(id, formatCommands(newCommand));
	}
	if (updatedCommands.size) stream.write(["Updated", updatedCommands.size]);

	if (!newCommands.size && !deletedCommands.length && !updatedCommands.size)
		log("All commands already deployed!");
	else console.log("\n");
};

/**
 * Recursively checks that all options for an {@link ApplicationCommand} are equal to the provided options.
 * In most cases it is better to compare using {@link ApplicationCommand#equals}
 * @param {import("eris").ApplicationCommandOptions[]} existing The options on the existing command,
 * should be {@link ApplicationCommand#options}
 * @param {import("eris").ApplicationCommandOptions[]} options The options to compare against
 * @param {boolean} [enforceOptionOrder=false] Whether to strictly check that options and choices are in the same
 * order in the array <info>The client may not always respect this ordering!</info>
 * @returns {boolean}
 */
function optionsEqual(existing, options, enforceOptionOrder = false) {
	if (existing.length !== options.length) return false;
	if (enforceOptionOrder) {
		return existing.every((option, index) =>
			optionEquals(option, options[index], enforceOptionOrder)
		);
	}
	const newOptions = new Map(options.map((option) => [option.name, option]));
	for (const option of existing) {
		const foundOption = newOptions.get(option.name);
		if (!foundOption || !optionEquals(option, foundOption)) return false;
	}
	return true;
}

/**
 * Checks that an option for an {@link ApplicationCommand} is equal to the provided option
 * In most cases it is better to compare using {@link ApplicationCommand#equals}
 * @param {import("eris").ApplicationCommandOptions} existing The option on the existing command,
 * should be from {@link ApplicationCommand#options}
 * @param {import("eris").ApplicationCommandOptions} option The option to compare against
 * @param {boolean} [enforceOptionOrder=false] Whether to strictly check that options or choices are in the same
 * order in their array <info>The client may not always respect this ordering!</info>
 * @returns {boolean}
 */
function optionEquals(existing, option, enforceOptionOrder = false) {
	if (
		option.name !== existing.name ||
		option.type !== existing.type ||
		option.description !== existing.description ||
		option.autocomplete !== existing.autocomplete ||
		(option.required ??
			([
				ApplicationCommandOptionTypes.SUB_COMMAND,
				ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
			].includes(option.type)
				? undefined
				: false)) !== existing.required ||
		option.choices?.length !== existing.choices?.length ||
		option.options?.length !== existing.options?.length ||
		(option.channel_types ?? option.channel_types)?.length !==
			existing.channel_types?.length ||
		(option.min_value ?? option.min_value) !== existing.min_value ||
		(option.max_value ?? option.max_value) !== existing.max_value
	) {
		return false;
	}

	if (existing.choices) {
		if (
			enforceOptionOrder &&
			!existing.choices.every(
				(choice, index) =>
					choice.name === option.choices[index].name &&
					choice.value === option.choices[index].value
			)
		) {
			return false;
		}
		if (!enforceOptionOrder) {
			const newChoices = new Map(
				option.choices.map((choice) => [choice.name, choice])
			);
			for (const choice of existing.choices) {
				const foundChoice = newChoices.get(choice.name);
				if (!foundChoice || foundChoice.value !== choice.value)
					return false;
			}
		}
	}

	if (existing.channelTypes) {
		const newTypes = option.channelTypes ?? option.channel_types;
		for (const type of existing.channelTypes) {
			if (!newTypes.includes(type)) return false;
		}
	}

	if (existing.options) {
		return optionsEqual(existing.options, option.options, enforceOptionOrder);
	}
	return true;
}
