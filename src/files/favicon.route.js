import { readFile } from "fs/promises";
import mime from "mime-types";

export const FaviconRoute = {
	async get(_, res) {
		try {
			const mimetype = mime.lookup("ico");
			const buffer = await readFile(`./public/favicon.ico`);

			res.writeHead(200, { "Content-Type": mimetype });
			res.end(buffer);
		} catch (_) {
			res.writeHead(404, { "Content-Type": "text/html" });
			res.end("<p>This is an HTML 404 page</p>");
			return;
		}
	},
};
