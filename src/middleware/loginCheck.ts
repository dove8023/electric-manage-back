/*
 * @Author: Hearth 
 * @Date: 2022-12-05 11:53:58 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-05 12:13:17
 * @content what is the content of this file. */

import { Next, Context } from "koa";
import cache from "../common/cache";
import { ContextCustomer } from "../interface";


const allowPath = ["/login", "/ping"];

export async function loginCheck(ctx: Context & ContextCustomer, next: Next){

	const url = ctx.path.toLowerCase();

	if(allowPath.indexOf(url) > -1){
		return next();
	}
	
	const { token } = ctx.request.header;
	if(!token){
		return ctx.error(100);
	}

	if(typeof token !== "string" || token.length !== 32){
		return ctx.error(102);
	}

	const result = await cache.read(token);
	if(!result){
		return ctx.error(101);
	}

	return next();
}
