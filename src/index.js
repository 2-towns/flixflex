import findMyWay from "find-my-way";
import http from "http";
import { logger } from "./logger/logger.js";
import { Context } from "./http/context.js";
import { strings } from "./strings/strings.js";
import { FilesRoute } from "./files/files.route.js";
import { FaviconRoute } from "./files/favicon.route.js";
import { CustomResponse } from "./http/response.js";
import { CustomRequest } from "./http/request.js";
import { DetailsRoute } from "./media/detail.route.js";
import { LoginRoute } from "./auth/login.route.js";
import cookie from "cookie";
import { LogoutRoute } from "./auth/logout.route.js";
import { FavoriteRoute } from "./favorites/favorite.route.js";
import { SearchRoute } from "./media/search.route.js";
import { MediaRoute } from "./media/media.route.js";
import { Templates } from "./templates/template.js";
import { LoginService } from "./auth/login.service.js";

const router = new findMyWay({
	defaultRoute: async (req, res) => {
		res.statusCode = 404;

		const safe = true;
		const user = await LoginService.current(safe);

		const html = await Templates.renderFile("error", {
			title: "Page not found",
			description: "This page is not found or does not exist anymore.",
			code: 404,
			error_title: "Page not found",
			error_message: "This page is not found or does not exist anymore.",
			user,
		});
		res.html(html);
	},
});

router.get("/css/:filename.:ext", FilesRoute.get);
router.get("/js/:filename.:ext", FilesRoute.get);
router.get("/svg/:filename.:ext", FilesRoute.get);
router.get("/favicon.ico", FaviconRoute.get);
router.get("/:type/:id/:title.html", DetailsRoute.get);
router.get("/:type/search.html", SearchRoute.get);
router.get("/login.html", LoginRoute.get);
router.post("/login.html", LoginRoute.post);
router.get("/favorites.html", FavoriteRoute.get);
router.post("/favorites.html", FavoriteRoute.post);
router.post("/logout.html", LogoutRoute.post);
router.get("/", MediaRoute.get);
router.get("/series.html", MediaRoute.get);

const options = {
	IncomingMessage: CustomRequest,
	ServerResponse: CustomResponse,
};

const server = http.createServer(options, (req, res) => {
	const cookies = cookie.parse(req.headers["cookie"]);
	const map = new Map([
		["request-id", strings.random()],
		["session-id", cookies["session-id"] || ""],
	]);

	Context.run(map, async function () {
		try {
			await router.lookup(req, res);
		} catch (e) {
			logger.error(e.stack);

			if (req.isHX()) {
				const html = await Templates.renderFile("alert", {
					error_message: e.message,
				});
				res.setHeader("HX-Retarget", "#alert");
				res.setHeader("HX-Push-Url", "false");
				res.setHeader("HX-Reswap", "innerHTML");
				res.html(html);
			} else {
				const safe = true;
				const user = await LoginService.current(safe);

				const html = await Templates.renderFile("error", {
					title: "Error",
					description: "Something went wrong",
					code: 400,
					error_title: "Oops...Something went wrong.",
					error_message: e.message,
					user,
				});
				res.html(html);
			}
		}
	});
});

server.listen(process.env.PORT, (err) => {
	if (err) {
		throw err;
	}

	logger.info("server listening on " + process.env.PORT);
});
