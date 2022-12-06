/*
 * @Author: Hearth 
 * @Date: 2022-11-29 17:06:43 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-06 12:28:17
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

export enum USER_OPTION_TYPE {
	RESETPASSWORD = "RESET_PASSWORD",
	CHANGESTATE = "CHANGE_STATE"
}

export enum USER_STATE {
	ENABLE = "ENABLE",
	DISABLE = "DISABLE"
}

/* Element model */

export enum ATTRIBUTE_TYPE {
	INPUT = "input",
	RANGE = "range",
	SELECT = "select"
}

export interface ATTRIBUTE {
	groupName: string;
	unit: string;
	type: ATTRIBUTE_TYPE;
	id: string;
	defaultValue: string | string[];
	options?: { label: string; value: string | number }[]
}
