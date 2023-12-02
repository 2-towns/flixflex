import { ServerResponse } from "http";

export class CustomResponse extends ServerResponse {
	/**
	 * Shortcut to render html content
	 * @param {string} html
	 */
	html(html) {
		const buffer = Buffer.from(html);

		const headers = {
			"Content-Type": "text/html;charset=UTF-8",
			"Content-Length": buffer.length,
			Date: new Date().toUTCString(),
		};

		this.writeHead(200, headers);
		this.write(html);
		this.end();
	}
}
