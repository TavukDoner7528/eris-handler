import pkg from "../package.json" assert { type: "json" };
import { parse } from "node-html-parser";
import got from "got";

export default async function check() {
	const modules = Object.entries(pkg.dependencies).map((v) => [
		v[0],
		v[1].match(/([0-9]|\.|-|@)+/gi)?.join("") || v[1],
	]);
	const requireUpdate = [];

	for (const [name, currentVersion] of modules) {
		const body = await got(`https://www.npmjs.com/package/${name}`).then(
			(res) => (res.statusCode === 200 ? res.body : null)
		);
		if (body) {
			const document = parse(body);
			const newVersion = document.querySelector(
				"p[class='f2874b88 fw6 mb3 mt2 truncate black-80 f4']"
			).text;
			if (newVersion !== currentVersion) {
				requireUpdate.push({ name, currentVersion, newVersion });
			}
		}
	}

	return requireUpdate;
}
