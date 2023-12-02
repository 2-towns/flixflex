import { IMAGE_URL, ITEMS_PER_PAGE } from "../constants.js";
import { Templates } from "../templates/template.js";
import { MediaService } from "./media.service.js";
import { TopRatedService } from "../top-rated/top-rated.service.js";
import { LoginService } from "../auth/login.service.js";

export const MediaRoute = {
	async get(req, res, __, ___, searchParams) {
		const [pathname] = req.url.split("?");
		const type = pathname === "/" ? "movie" : "tv";
		let page = 1;

		if (searchParams) {
			page = parseInt(searchParams.page || "1", 10);
		}

		const { items, total, pages } = await MediaService.list(page || 1, type);

		const topRated = await TopRatedService.list(`/${type}/top_rated`, type);

		const safe = true;
		const user = await LoginService.current(safe);
		const name = req.isHX() ? "list" : "media";
		const active = type === "movie" ? 1 : 2;

		const html = await Templates.renderFile(name, {
			topRated,
			pages,
			page,
			total,
			type,
			cachebuster: Date.now(),
			title: type === "movie" ? "Movies" : "Series",
			description:
				"Discover the last " + type === "movie" ? "movies" : "series",
			items,
			imageURL: IMAGE_URL,
			hasPagination: true,
			hasSearch: true,
			user,
			active,
		});

		res.html(html);
	},
};
