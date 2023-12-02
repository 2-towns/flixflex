import { LoginService } from "../auth/login.service.js";
import { Favorite } from "./favorite.model.js";

export const FavoriteService = {
	async list() {
		const user = await LoginService.current();
		const items = await Favorite.list(user.username);

		return items.map((item) => ({
			id: item.id,
			title: item.title,
			vote_average: item.vote,
			backdrop_path: item.image,
			type: item.type,
		}));
	},

	/**
	 * Add a favorite
	 * @param {string} id
	 * @param {string} type
	 * @param {string} title
	 * @param {string} vote
	 * @param {string} image
	 */
	async add(id, type, title, vote, image) {
		const user = await LoginService.current();
		return Favorite.add(user.username, type, id, title, vote, image);
	},

	/**
	 * Delete a favorite
	 * @param {string} id
	 * @param {string} type
	 */
	async delete(id, type) {
		const user = await LoginService.current();
		return Favorite.delete(user.username, id, type);
	},

	/**
	 * Check if a favorite is in the user favorite list.
	 * @param {string} id
	 * @param {string} type
	 */
	async has(id, type) {
		const safe = true;
		const user = await LoginService.current(safe);
		if (!user) {
			return false;
		}

		return Favorite.has(user.username, id, type);
	},
};
