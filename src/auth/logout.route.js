import { Context } from "../http/context.js";
import { LoginService } from "./login.service.js";

export const LogoutRoute = {
	/**
	 * This endpoint is used to destroy the current session.
	 * The expected content type is application/x-www-form-urlencoded.
	 * After it is done, the user is redirected to the home page.
	 * @param {Request} req
	 * @param {Request} res
	 */
	async post(req, res) {
		if (req.headers["hx-request"] !== "true") {
			throw new Error("The request is not an HX request");
		}

		const sid = Context.get("session-id");

		await LoginService.deleteSession(sid);

		res.setHeader("HX-Redirect", "/");
		res.html("");
	},
};
