import { Context } from "../http/context.js";
import { strings } from "../strings/strings.js";
import { User } from "./user.model.js";
import crypto from "crypto";

export const LoginService = {
	/**
	 * Make a login attempt.
	 * If the username exists, a hash will be generated and compared with
	 * the hash stored in the database. If it matches, the login is completed.
	 * If the username does not exist, the user will be created and the password
	 * hash will be stored in the database.
	 * Once the login is completed, a session is generated and stored into the Redis.
	 * @param {string} username
	 * @param {string} password
	 * @returns
	 */
	async login(username, password) {
		if (!username || !password) {
			throw new Error("The username and the password are required.");
		}

		const u = await User.get(username);
		if (u) {
			const hash = crypto
				.pbkdf2Sync(password, u.salt, 1000, 64, `sha512`)
				.toString(`hex`);

			if (hash !== u.hash) {
				throw new Error("The password does not match.");
			}

			const sid = strings.random();

			await User.createSession(sid, username);

			return sid;
		}

		const salt = crypto.randomBytes(16).toString("hex");
		const hash = crypto
			.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
			.toString(`hex`);
		const sid = strings.random();

		await User.set(username, salt, hash, sid);

		return sid;
	},

	/**
	 * Returns the current user.
	 * If the contains contains the user, it is returned.
	 * Otherwise it will take the session id from the context (which
	 * comes from the cookies) and looks into Redis to get the session.
	 * If the session is not found, an error is raised if the safe
	 * parameter is false, otherwise null is returned.
	 * @param {boolean} safe
	 */
	async current(safe) {
		if (Context.get("user")) {
			return Context.get("user");
		}

		const sid = Context.get("session-id");

		if (!sid) {
			if (safe) {
				return null;
			}

			throw new Error("You are not authorized to proceed.");
		}

		const user = await User.findBySessionId(sid);
		if (!user) {
			if (safe) {
				return null;
			}

			throw new Error("You are not authorized to proceed.");
		}

		return user;
	},

	/**
	 * Delete the session corresponding to the session id.
	 * @param {string} sid
	 */
	deleteSession(sid) {
		return User.deleteSession(sid);
	},
};
