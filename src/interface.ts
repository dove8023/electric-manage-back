/*
 * @Author: Hearth 
 * @Date: 2022-11-29 17:06:43 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 19:42:45
 * @content what is the content of this file. */

import { Context } from "koa";

export interface ContextCustomer extends Context {
	success<Type>(data: Type): void;
	error(code: number, msg?: string): void;
	logger: {
		info(data: DATA): void;
		warn(data: DATA): void;
		error(data: DATA): void;
	}
}

export interface DATA {
	[index: string]: string | number | boolean | object
}
