import { IMAGE_URL } from "../constants.js";
import { FavoriteRoute } from "../favorites/favorite.route.js";
import { Templates } from "../templates/template.js";
import { LoginService } from "../auth/login.service.js";
import { MediaService } from "./media.service.js";

export const DetailsRoute = {
	async get(_, res, params) {
		const { id, type } = params;

		const { item, video } = await MediaService.details(id, type);
		const isMember = await FavoriteRoute.has(id, type);
		const action = isMember ? "delete" : "add";
		const active = type === "movie" ? 1 : 2;
		const safe = true;
		const user = await LoginService.current(safe);

		const html = await Templates.renderFile("details", {
			title: item.title,
			description: item.overview,
			imageURL: IMAGE_URL,
			item,
			video,
			action,
			type,
			active,
			user,
			vals: JSON.stringify({
				id,
				type,
				title: item.title || item.name,
				vote: item.vote_average,
				image: item.backdrop_path,
				action,
			}),
		});

		res.html(html);
	},
};
