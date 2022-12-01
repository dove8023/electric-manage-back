/*
 * @Author: Hearth 
 * @Date: 2022-12-01 15:42:10 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 16:16:30
 * @content what is the content of this file. */

import DB from "../common/db";
import User from "./user";
import SuperUser from "./superUser";

DB.sync();

export default {
	User,
	SuperUser
};
