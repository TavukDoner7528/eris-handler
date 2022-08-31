import boxen from "boxen";
import chalk from "chalk";

/** @type {import("../typings").Log} */
export default {
	log,
	update,
	warning,
	error,
	info,
};

/**
 * @type {import("../typings").Log["update"]}
 */
export function update(message, curV, newV) {
	console.log(
		boxen(` ${message} `, {
			title:
				arguments.length > 0 && !!newV
					? `${chalk.green(curV)} -> ${chalk.green(newV)}`
					: undefined,
			borderStyle: "round",
			borderColor: "cyan",
		})
	);
}

/**
 * @type {import("../typings").Log["warning"]}
 */
export function warning(message) {
	console.log(
		boxen(` ${message} `, {
			title: "Warning",
			borderStyle: "round",
			borderColor: "#ed9f00",
		})
	);
}

/**
 * @type {import("../typings").Log["error"]}
 */
export function error(message, throwing = false) {
	if (throwing)
		throw new Error(
			boxen(` ${message} `, {
				title: chalk.red("Error"),
				borderStyle: "round",
				borderColor: "red",
			})
		);
	else
		console.log(
			boxen(` ${message} `, {
				title: chalk.red("Error"),
				borderStyle: "round",
				borderColor: "red",
			})
		);
}

/**
 * @type {import("../typings").Log["info"]}
 */
export function info(message) {
	console.log(
		boxen(` ${message} `, {
			title: "Info",
			borderStyle: "round",
			borderColor: "green",
		})
	);
}

/**
 * @type {import("../typings").Log["log"]}
 */
export function log(message, options) {
	console.log(
		typeof options === "object"
			? boxen(` ${message} `, options)
			: typeof options === "string"
			? boxen(` ${message} `, { title: options })
			: boxen(` ${message} `)
	);
}
