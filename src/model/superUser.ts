/*
 * @Author: Hearth 
 * @Date: 2022-12-01 15:28:27 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 16:16:04
 * @content what is the content of this file. */

import { DataTypes } from "sequelize";
import DB from "../common/db";

export default DB.define(
	"superUser",
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		username: {
			type: DataTypes.STRING(50),
			unique: true
		},
		password: DataTypes.CHAR(32),
		lastLogin: DataTypes.DATE,
	},
	{
		timestamps: true,
		paranoid: true,
		tableName: "superUser",
		charset: "utf8mb4"
	}
);
