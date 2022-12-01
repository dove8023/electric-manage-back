/*
 * @Author: Hearth 
 * @Date: 2022-11-29 15:59:05 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 19:33:01
 * @content what is the content of this file. */

import koa, { Context, Next } from "koa";
import loggerMiddle from "../middleware/logger";
import { v1 } from "uuid";
import Dayjs from "dayjs";
import { response } from "../middleware/response";
import cors from "koa2-cors";
import bodyParser from "koa-bodyParser";

const app = new koa();

app.use(async (ctx: Context, next: Next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set("X-Response-Time", `${ms}ms`);

	console.log(`${Dayjs().format()}, ${ctx.method}, ${ms}ms, ${ctx.status}, ${ctx.url}`);
});

app.use(loggerMiddle);
app.use(response);
app.use(cors({
	origin: "*",
	exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
	maxAge: 5,
	credentials: true,
	allowMethods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization", "Accept", "token"],
}));
app.use(bodyParser());
app.use(async (ctx: Context, next: Next) => {
	try {
		ctx.response.type = "json";
		ctx.state.traceId = v1();
		await next();
	} catch (err: any) {
		ctx.response.status = err.status || err.statusCode || 500;
		ctx.response.type = "text";
		ctx.response.body = err.message || err;
		console.log(`http请求报错, ${ctx.url}`, err);
		ctx.logger.error(`http error catched, ${err}`);
		ctx.error(500, `http error catched, ${err}`);
	}
});

export default app;
