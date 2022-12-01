/*
 * @Author: Heath 
 * @Date: 2022-10-18 09:40:43 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 19:32:21
 * @content what is the content of this file. */

import { Next, Context } from "koa";
import errorMsg from "../common/errorMsg";

export async function response(ctx: Context, next: Next) {
	ctx.success = function<Type> (data: Type) {
		ctx.body = {
			code: 0,
			msg: "ok",
			data
		};
	};

	ctx.error = function (code: number, msg?: string) {
		ctx.body = {
			code,
			msg: msg || errorMsg[code],
			data: null
		};
	};

	await next();
}
