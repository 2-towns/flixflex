import { IMAGE_URL } from "../constants.js";
import { Templates } from "../templates/template.js";
import { FavoriteService } from "./favorite.service.js";
import { LoginService } from "../auth/login.service.js";

export const FavoriteRoute = {
	async get(_, res) {
		const favorites = await FavoriteService.list();
		const safe = true;
		const user = await LoginService.current(safe);

		if (favorites.length == 0) {
			const html = await Templates.renderFile("error", {
				title: "Favorites",
				description: "List your favorites",
				code: 204,
				error_title: "Oops...You don't have favorite.",
				error_message:
					"Check your favorite movie or serie, and it to your favorite list.",
				active: 3,
				user,
			});
			res.html(html);
			return;
		}

		const html = await Templates.renderFile("favorites", {
			cachebuster: Date.now(),
			title: "Favorites",
			description: "List your favorites",
			items: favorites,
			imageURL: IMAGE_URL,
			active: 3,
			user,
		});
		res.html(html);
	},

	/**
	 * This endpoint toggle a movie or a serie into the user favorite list.
	 * The expected content type is application/x-www-form-urlencoded.
	 * The parameters expected are:
	 * - id: the movie/serie id
	 * - action: "delete" if the user has the favorite, "add" otherwise
	 * - type: "movie" or "tv"
	 * - title: the movie/serie title
	 * - vote: the movie/serie vote
	 * - image: the movie/serie image
	 * @param {Request} req
	 * @param {Response} res
	 */
	async post(req, res) {
		if (req.headers["hx-request"] !== "true") {
			throw new Error("The request is not an HX request");
		}

		const { id, action, type, title, vote, image } = await req.parse();

		if (action === "delete") {
			await FavoriteService.delete(id, type);
			const html = await Templates.renderFile("bookmark", {
				action: "add",
				vals: JSON.stringify({ id, type, title, vote, image }),
			});

			res.html(html);
		} else {
			await FavoriteService.add(id, type, title, vote, image);
			const html = await Templates.renderFile("bookmark", {
				action: "delete",
				vals: JSON.stringify({ id, type, title, vote, image }),
			});
			res.html(html);
		}
	},

	async has(id, type) {
		return FavoriteService.has(id, type);
	},
};
