import { IMAGE_URL } from "../constants.js";
import { Templates } from "../templates/template.js";
import { LoginService } from "./login.service.js";
import cookie from "cookie";

export const LoginRoute = {
	async get(_, res) {
		const safe = true;
		const user = await LoginService.current(safe);

		if (user) {
			res.writeHead(302, {
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Date: new Date().toUTCString(),
				Location: "/",
			});
			res.end();
			return;
		}

		const html = await Templates.renderFile("login", {
			title: "Login",
			description: "Connect or create an account",
			imageURL: IMAGE_URL,
		});

		res.html(html);
	},

	/**
	 * This endoint is used for login.
	 * The expected content type is application/x-www-form-urlencoded.
	 * An error is raised if the username or the password are empty.
	 * If the username exists, a hash will be generated and compared with
	 * the hash stored in the database. If it matches, the login is completed.
	 * If the username does not exist, the user will be created and the password
	 * hash will be stored in the database.
	 * Once the login is completed, a session and created and the cookie is added to the
	 * client and contains the session id.
	 * @param {Request} req
	 * @param {Response}
	 */
	async post(req, res) {
		if (req.headers["hx-request"] !== "true") {
			throw new Error("The request is not an HX request");
		}

		const { username, password } = await req.parse();

		const sid = await LoginService.login(username, password);

		res.setHeader(
			"Set-Cookie",
			cookie.serialize("session-id", sid, {
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 7,
				path: "/",
				secure: true,
			}),
		);
		res.setHeader("HX-Redirect", "/");
		res.html("");
	},
};
