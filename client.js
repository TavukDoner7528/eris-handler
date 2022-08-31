import { Client } from "eris";

const client = new Client(process.env.TOKEN, {
	intents: ["all"],
	defaultImageFormat: "png",
	defaultImageSize: 256,
});

export default client;
