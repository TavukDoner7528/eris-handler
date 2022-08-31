import _ from "lodash";
import { Constants } from "eris";
const { Permissions } = Constants;

/**
 *
 * @param {import("../typings").PermissionResolvable} permissions
 * @returns {number}
 */
export default function formatPermissions() {
	const args = Array.from(arguments).concat.apply([], Array.from(arguments));
	if (!args.filter((p) => !!p).length) return 0;

	return args
		.filter((p) => !!p)
		.map(convertPermission)
		.reduce((total, perm) => total + perm, 0);
}

export function convertPermission(permission) {
	return typeof permission === "string"
		? Number(Permissions[toPascalCase(permission)])
		: Number(permission);
}

function toPascalCase(string) {
	let camelCase = _.camelCase(string);
	let PascalCase = _.upperFirst(camelCase);

	return PascalCase;
}
