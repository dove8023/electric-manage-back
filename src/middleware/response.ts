/*
 * @Author: Heath 
 * @Date: 2022-10-18 09:40:43 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-11-30 10:17:12
 * @content what is the content of this file. */


import { Next } from "koa";
import { ContextCustomer } from "src/interface";
import errorMsg from "../common/errorMsg";


export function response(ctx: ContextCustomer, next: Next) {
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

	next();
}
