/*
 * @Author: Hearth 
 * @Date: 2022-12-01 12:47:11 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 14:48:39
 * @content what is the content of this file. */

import { createClient, RedisClientType } from "redis";
const HOST = process.env.REDIS_HOST || "localhost";
const PORT = Number(process.env.REDIS_PORT) || 6379;
const DB = Number(process.env.REDIS_DB) || 0;

export class Cache {
	private _client: RedisClientType;

	constructor() {
		this._client = createClient({
			url: `redis://${HOST}:${PORT}`,
			database: DB
		});
	}

	async read(id: string) {
		let result = await this._client.get(id);
		if(!result){
			return null;
		}
		try {
			result = JSON.parse(result);
		} catch (e) {
			// ignore
		} 

		return result;
	}

	write(id: string, content: string | object, EX?: number) {
		if (typeof content == "object") {
			content = JSON.stringify(content);
		}

		return this._client.set(id, content, {
			EX
		});
	}

	del(id: string) {
		return this._client.del(id);
	}
}

const cache = new Cache();
export default cache;
