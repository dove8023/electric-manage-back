/*
 * @Author: Hearth 
 * @Date: 2022-12-01 15:28:27 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 15:54:35
 * @content what is the content of this file. */

import { DataTypes } from "sequelize";
import DB from "../common/db";

export default DB.define(
	"user",
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		openid: {
			type: DataTypes.STRING(50),
			unique: true
		},
		nickName: DataTypes.STRING,
		avatarUrl: DataTypes.STRING,
		city: DataTypes.STRING,
		country: DataTypes.STRING,
		gender: DataTypes.STRING,
		language: DataTypes.STRING,
		province: DataTypes.STRING,
		mobile: DataTypes.CHAR(11),
		inviterId: DataTypes.UUID,
	},
	{
		timestamps: true,
		paranoid: true,
		tableName: "user",
		charset: "utf8mb4"
	}
);
