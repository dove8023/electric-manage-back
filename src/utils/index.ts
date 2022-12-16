/*
 * @Author: Hearth 
 * @Date: 2022-12-05 10:29:10 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-16 22:31:15
 * @content what is the content of this file. */

export * from "./element";

import { DATA } from "../interface";

const lowercase = "abcdefghijklmnopqrstuvwxyz",
	uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	numbers = "0123456789",
	symbols = "!@#$%&*?~";
const pool = [lowercase, uppercase, numbers, symbols].join("");

export function generatePassword(max: number): string{
	let password = "";
	for(let i=1;i<=max;i++){
		const index = Math.floor(Math.random() * pool.length);
		password += pool[index];
	}

	return password;
}


export function formatToCamelCase(data: DATA):any{
	const result = Object.entries(data);

	for(const item of result){
		if(item[0].indexOf("_") < 0){
			continue;
		}

		const key = item[0];
		item[0] = key.replace(/_[a-z]/ig, (res)=>{
			return res.substring(1).toUpperCase();
		});
	}

	return Object.fromEntries(result);
}

export function formatRawData(data: DATA, tables: string[]): DATA | null {
	const result:any = {};
	for(const table of tables){
		result[table]= {};
	}

	const keyAndValues = Object.entries(data);
	for(const item of keyAndValues){
		const key = item[0];
		let value = item[1];
		const [tableName, columnName] = key.split("_");

		const target = result[tableName];
		if(!target){
			return null;
		}

		try {
			value = JSON.parse(value as string);
		} catch (err) {
			// ignore err
		}
		
		target[columnName] = value;
	}

	return result;
}
