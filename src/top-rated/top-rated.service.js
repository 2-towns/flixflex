import { TheMovieDbService } from "../themoviedb/themoviedb.service.js";

export const TopRatedService = {
	/**
	 * Get the top rated movies or series
	 * @param {string} path
	 * @param {string} type
	 */
	async list(path, type) {
		const page = 1;
		const { results } = await TheMovieDbService.list(path, page);
		return results.slice(0, 5).map((item) => ({ ...item, type }));
	},
};
