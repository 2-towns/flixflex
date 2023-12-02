import { AsyncLocalStorage } from "async_hooks";

/**
 * Context used to retrieve the request info.
 */
class HttpContext extends AsyncLocalStorage {
	get(key) {
		const store = this.getStore();

		if (!store) {
			return "";
		}

		return this.getStore().get(key);
	}

	set(key, value) {
		const store = this.getStore();

		if (!store) {
			return;
		}

		return this.getStore().get(key, value);
	}
}

export const Context = new HttpContext();
