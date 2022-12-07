/*
 * @Author: Hearth 
 * @Date: 2022-11-29 17:06:43 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-07 09:56:34
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

export interface SELECT_OPTION {
	label: string;
	value: number
}

export interface ELEMENT_ATTRIBUTE {
	groupName: string;
	name: string;
	unit: string;
	type: ATTRIBUTE_TYPE;
	defaultValue: number | number[];
	options?: SELECT_OPTION[]
}
