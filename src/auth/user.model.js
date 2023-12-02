import { DB } from "../db/redis.js";
import { logger } from "../logger/logger.js";
export class User {
	/**
	 * Get the user info from redis.
	 * The key is user:{{username}}
	 * @param {string} username
	 */
	static async get(username) {
		logger.info("get user data from redis");

		const user = await DB.hGetAll("user:" + username);

		if (Object.keys(user).length === 0) {
			return null;
		}

		return user;
	}

	/**
	 * Store the user info into redis.
	 * The user data key is user:{{username}}
	 * The session data key is session:{{sid}}
	 * @param {string} username
	 * @param {string} salt
	 * @param {string} hash
	 * @param {string} sid
	 * @returns
	 */
	static async set(username, salt, hash, sid) {
		logger.info("set user data to redis");

		const multi = DB.multi();

		multi.hSet("user:" + username, { salt, hash, username });
		multi.set("session:" + sid, username);

		return multi.exec();
	}

	/**
	 * Get the user corresponding to a session.
	 * The session data key is session:{{sid}}
	 * The user data key is user:{{username}}
	 * @param {string} sid
	 */
	static async findBySessionId(sid) {
		const username = await DB.get("session:" + sid);
		if (!username) {
			return null;
		}

		const user = await DB.hGetAll("user:" + username);
		if (!user) {
			return null;
		}

		return user;
	}

	/**
	 * Create a new session by linking the session id and
	 * the username.
	 * The session data key is session:{{sid}}
	 * @param {string} sid
	 * @param {string} username
	 * @returns
	 */
	static createSession(sid, username) {
		return DB.set("session:" + sid, username);
	}

	/**
	 * Destroy a session.
	 * The session data key is session:{{sid}}
	 * @param {string} sid
	 * @returns
	 */
	static deleteSession(sid) {
		return DB.del("session:" + sid);
	}
}
