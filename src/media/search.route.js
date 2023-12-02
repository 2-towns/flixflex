import { IMAGE_URL } from "../constants.js";
import { Templates } from "../templates/template.js";
import { MediaRoute } from "./media.route.js";
import { MediaService } from "./media.service.js";

export const SearchRoute = {
	async get(req, res, params, __, searchParams) {
		const { query } = searchParams;
		const { type } = params;

		if (!query) {
			await MediaRoute.get(req, res);
			return;
		}

		const { items } = await MediaService.search(query, type);

		const html = await Templates.renderFile("list", {
			type,
			cachebuster: Date.now(),
			items,
			imageURL: IMAGE_URL,
			title: type === "movie" ? "Movie" : "Serie" + " search",
		});

		res.html(html);
	},
};
