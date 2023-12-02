import { readFile } from "fs/promises";
import mime from "mime-types";

export const FilesRoute = {
	async get(_, res, params) {
		const { filename, ext } = params;

		try {
			const mimetype = mime.lookup(ext);
			const type = mime.extension(mimetype);
			const buffer = await readFile(`./public/${type}/${filename}.${ext}`);

			res.writeHead(200, { "Content-Type": mimetype });
			res.end(buffer);
		} catch (_) {
			res.writeHead(404, { "Content-Type": "text/html" });
			res.end("<p>This is an HTML 404 page</p>");
			return;
		}
	},
};
