/*
 * @Author: Hearth 
 * @Date: 2022-12-05 10:29:10 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-06 15:59:04
 * @content what is the content of this file. */

export * from "./element";

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

