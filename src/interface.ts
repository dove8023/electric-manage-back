/*
 * @Author: Hearth 
 * @Date: 2022-11-29 17:06:43 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-05 22:03:35
 * @content what is the content of this file. */

import { Request } from "./../node_modules/@types/express-serve-static-core/index.d";

export interface ContextCustomer {
	success<Type>(data: Type): void;
	error(code: number, msg?: string): void;
	logger: {
		info(data: DATA): void;
		warn(data: DATA): void;
		error(data: DATA): void;
	}

	request: Request & {
		body: DATA
	}
}

export interface DATA {
	[index: string]: string | number | boolean | object
}

export const PASSWORD_DEFAULT_LENGTH = 15;
