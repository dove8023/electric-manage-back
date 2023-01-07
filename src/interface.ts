/*
 * @Author: Hearth 
 * @Date: 2022-11-29 17:06:43 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-31 12:30:14
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

export enum STATE {
	DISABLE = "DISABLE",
	ENABLE = "ENABLE"
}

/* Element model */

export enum ATTRIBUTE_TYPE {
	INPUT = "INPUT",
	RANGE = "RANGE",
	SELECT = "SELECT"
}

export interface SELECT_OPTION {
	label: string;
	value: number
}

export interface ELEMENT_ATTRIBUTE {
	groupName: string;
	zhName: string;
	enName: string;
	unit: string;
	type: ATTRIBUTE_TYPE;
	defaultValue: number | number[];
	options?: SELECT_OPTION[]
}

export interface DEVICE_ATTRIBUTE extends ELEMENT_ATTRIBUTE {
	isPrefix?: boolean
}

export interface PROJECT_ATTRIBUTE {
	name: string;
	value: number | number[];
}
