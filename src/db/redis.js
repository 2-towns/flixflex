import { createClient } from "redis";
import { logger } from "../logger/logger.js";

export const DB = createClient({});

DB.on("error", (err) => console.error(err));

DB.connect().then(() => {
	logger.info("redis client connected");
});
