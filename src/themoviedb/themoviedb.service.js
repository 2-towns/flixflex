import { logger } from "../logger/logger.js";
import { API_RATIO, API_URL, ITEMS_PER_PAGE } from "../constants.js";

export const TheMovieDbService = {
	/**
	 * Make a call to the api.
	 * @param {string} path
	 */
	async fetch(path) {
		const res = await fetch(`${API_URL}/3${path}`, {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
			},
		});

		return res.json();
	},

	/**
	 * List the items from the API.
	 * Since the API the items number returned by the API is not configurable (20),
	 * we need to make some trick to display only 10 items.
	 * So we will call the same page to display 10 + 10 elements.
	 * So to display the page 1 on our application, we will the the page 1 from the API.
	 * So to display the page 2 on our application, we will the the page 1 from the API.
	 * So to display the page 3  on our application, we will the the page 2 from the API.
	 * So to display the page 4  on our application, we will the the page 2 from the API.
	 * So to display the page 5  on our application, we will the the page 3 from the API.
	 * And so on...
	 * @param {string} path
	 * @param {number} page
	 * @returns
	 */
	async list(path, page) {
		const apiPage = Math.round(page * API_RATIO);

		logger.info(`fetching with page=${apiPage} path=${path}`);

		const json = await TheMovieDbService.fetch(
			`${path}?language=en-US&page=` + apiPage,
		);

		logger.info(
			"got movies with total_pages=" +
				json.total_pages +
				" total_results=" +
				json.total_results,
		);

		// Let's take only the page items that we need
		const internalIndex = page % 2 === 0 ? ITEMS_PER_PAGE : 0;

		const results = json.results.slice(
			internalIndex,
			internalIndex + ITEMS_PER_PAGE,
		);

		return {
			results,
			total: json.total_results,
			pages: json.total_pages,
		};
	},
};
