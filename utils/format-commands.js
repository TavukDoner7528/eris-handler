// import discord, {
// 	PermissionsBitField,
// 	ApplicationCommandType,
// 	Collection,
// } from "discord.js";
import { Constants } from "eris";
import { Collection } from "@discordjs/collection";
import formatPermissions from "./format-permissions.js";
import formatOptions from "./format-options.js";
import _ from "lodash";

const { ApplicationCommandTypes } = Constants;

/**
 * @param {object[]|Collection<string, object>} commands
 * @returns {import("eris").ApplicationCommand[]|import("eris").ApplicationCommand}
 */
export default function (commands) {
	if (Array.isArray(commands))
		return (commands.size || commands.length) > 0 ? commands.map(format) : [];
	else if (typeof commands === "object") return format(commands);
	else return {};
}

/**
 * @param {{ name: string|string[], name_localizations?: discord.LocalizationMap, description: string|string[], description_localizations?: discord.LocalizationMap, options?: [], permissions?: [], default_member_permissions?: import("eris").ApplicationCommandPermissions, dm?: boolean, dm_permission?: boolean, type?: import("eris").ApplicationCommandTypes }}
 * @returns {ApplicationCommand}
 */
function format({
	name,
	description,
	options = [],
	permissions,
	default_member_permissions,
	dm,
	dm_permission,
	type,
}) {
	return {
		name: name,
		description: Array.isArray(description) ? description[0] : description,
		type:
			typeof type === "number"
				? type
				: ApplicationCommandTypes[toPascalCase(type)] || 1,
		options: formatOptions(options),
		default_member_permissions:
			formatPermissions(permissions) ||
			formatPermissions(default_member_permissions) ||
			0,
		dm_permission: !(dm || dm_permission) ? false : true,
	};
}

function toPascalCase(string) {
	let camelCase = _.camelCase(string);
	let PascalCase = _.upperFirst(camelCase);

	return PascalCase;
}
