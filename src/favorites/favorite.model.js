import { DB } from "../db/redis.js";

export class Favorite {
	/**
	 * List the favorites.
	 * The favorite movies data key is user:{{username}}:favorites:movie
	 * The favorite series data key is user:{{username}}:favorites:tv
	 * The favorites are stored in two different keys but merged into
	 * a single array.
	 * @param {string} username
	 * @returns
	 */
	static async list(username) {
		const [movies, series] = await Promise.all([
			Favorite.#favorites(username, "movie"),
			Favorite.#favorites(username, "tv"),
		]);

		return [...movies, ...series];
	}

	/**
	 * Retrieve the favorite list for a type given.
	 * @param {string} username
	 * @param {string} type
	 */
	static async #favorites(username, type) {
		const ids = await DB.sMembers("user:" + username + ":favorites:" + type);

		const items = [];

		for (const id of ids) {
			const item = await DB.hGetAll(type + ":" + id);
			if (item) {
				items.push(item);
			}
		}

		return items;
	}

	/**
	 * Add a favorited to an user.
	 * The favorite movies data key is user:{{username}}:favorites:movie
	 * The favorite series data key is user:{{username}}:favorites:tv
	 * In order to avoid to api calls to retrive the favorite data,
	 * the data are stored into Redis.
	 * @param {string} username
	 * @param {string} type
	 * @param {string} id
	 * @param {string} title
	 * @param {string} vote
	 * @param {string} image
	 * @returns
	 */
	static add(username, type, id, title, vote, image) {
		const multi = DB.multi();

		multi.sAdd("user:" + username + ":favorites:" + type, id);
		multi.hSet(type + ":" + id, { type, id, title, vote, image });

		console.info({ type, id, title, vote, image }, username);

		return multi.exec();
	}

	/**
	 * Delete a favorite.
	 * @param {string} username
	 * @param {string} id
	 * @param {string} type
	 */
	static delete(username, id, type) {
		return DB.sRem("user:" + username + ":favorites:" + type, id);
	}

	/**
	 * Check if a favorite exists for the user given.
	 * @param {string} username
	 * @param {string} id
	 * @param {string} type
	 */
	static has(username, id, type) {
		return DB.sIsMember("user:" + username + ":favorites:" + type, id);
	}
}
