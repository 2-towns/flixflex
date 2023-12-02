import { ITEMS_PER_PAGE, VIEMO_URL, YOUTUBE_URL } from "../constants.js";
import { TheMovieDbService } from "../themoviedb/themoviedb.service.js";

export const MediaService = {
	/**
	 * Retrieve the movie or serie detail
	 * @param {string} id
	 * @param {string} type
	 */
	async details(id, type) {
		const json =
			await TheMovieDbService.fetch(`/${type}/${id}?language=en-US&append_to_response=videos
		`);

		const video = json.videos.results[0];

		if (!video) {
			return { item: json };
		}

		if (video.site === "YouTube") {
			return { item: json, video: YOUTUBE_URL + video.key };
		}

		return { item: json, video: VIEMO_URL + video.key };
	},

	/**
	 * Search for a movie or serie
	 * @param {string} query
	 * @param {string} type
	 */
	async search(query, type) {
		const { results, total, pages } = await TheMovieDbService.fetch(
			`/search/${type}?language=en-US&query=${query}`,
		);

		return {
			pages: pages,
			total,
			items: results.slice(0, ITEMS_PER_PAGE).map((item) => ({
				...item,
				type,
				// use poster as fallback image
				backdrop_path: item.backdrop_path || item.poster_path,
			})),
		};
	},

	/**
	 * List movies or series.
	 * @param {number} page
	 * @param {string} type
	 * @returns
	 */
	async list(page, type) {
		const { results, total, pages } = await TheMovieDbService.list(
			"/discover/" + type,
			page,
		);

		return {
			pages: pages,
			total,
			items: results.map((item) => ({
				...item,
				title: item.title || item.name,
				type,
				// use poster as fallback image
				backdrop_path: item.backdrop_path || item.poster_path,
			})),
		};
	},
};
