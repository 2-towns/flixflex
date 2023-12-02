import tracer from "tracer";
import { Context } from "../http/context.js";

export const logger = tracer.colorConsole({
	format: [
		"{{timestamp}} {{rid}} <{{title}}> {{message}} (in {{file}}:{{line}})", //default format
		{
			error:
				"{{timestamp}} {{rid}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}", // error format
		},
	],
	dateformat: "HH:MM:ss.L",
	preprocess: function (data) {
		data.title = data.title.toUpperCase();
		data.rid = Context.get("request-id");
	},
});
