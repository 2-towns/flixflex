import { IncomingMessage, ServerResponse } from "http";
import { logger } from "../logger/logger.js";

export class CustomRequest extends IncomingMessage {
	/**
	 * Returns true if the request is coming from htmx.
	 */
	isHX() {
		logger.info("the request is htmx ", this.headers["hx-request"] === "true");
		return this.headers["hx-request"] === "true";
	}

	/**
	 * Parse the request body.
	 * The expected method is POST.
	 * The expected content type is application/x-www-form-urlencoded.
	 * @returns
	 */
	async parse() {
		if (
			this.method !== "POST" ||
			!this.headers["content-type"].includes(
				"application/x-www-form-urlencoded",
			)
		) {
			throw new Error("You are not authoried to process this request.");
		}

		const chunks = [];

		for await (const chunk of this) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);

		return Object.fromEntries(new URLSearchParams(buffer.toString()));
	}
}
