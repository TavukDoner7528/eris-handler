import { Constants } from "eris";
import formatPermissions from "./format-permissions.js";

const { ApplicationCommandOptionTypes: OptionTypes, ChannelTypes } = Constants;

export default function formatOptions(options) {
	if (!Array.isArray(options)) return options;

	return options
		.filter((o) => typeof o === "object")
		.map((/** @type {import("eris").ApplicationCommandOption} */ option) => ({
			...option,
			type:
				typeof option.type === "number"
					? option.type
					: OptionTypes[toPascalCase(option.type)],
			permissions: formatPermissions(permissions),
			channel_types: option.channel_types?.map((channel_type) =>
				typeof channel_type === "number"
					? channel_type
					: ChannelTypes[toPascalCase(channel_type)]
			),
		}));
}

function toPascalCase(string) {
	let camelCase = _.camelCase(string);
	let PascalCase = _.upperFirst(camelCase);

	return PascalCase;
}
