import crypto from "node:crypto";

export const strings = {
	/**
	 * Generate a random string.
	 * @param {number} size
	 * @returns
	 */
	random: function (size = 32) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		let result = "";

		for (let i = 0; i < size; i++) {
			const randomByte = crypto.randomBytes(1)[0];
			result += characters.charAt(randomByte % charactersLength);
		}

		return result;
	},
};
