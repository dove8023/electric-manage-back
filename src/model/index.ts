/*
 * @Author: Hearth 
 * @Date: 2022-12-01 15:42:10 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 15:57:50
 * @content what is the content of this file. */

import DB from "../common/db";
export * as User from "./user";
import User from "./user";

DB.sync();

export default {
	User
};


async function testOk(){
	const g = await User.create({nickName:"abdefg"});
	
	const result = await User.findAll();
	console.log(result);
}

testOk();
