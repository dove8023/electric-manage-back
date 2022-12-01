/*
 * @Author: Heath 
 * @Date: 2022-10-02 11:55:52 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 15:13:11
 * @content what is the content of this file. */

import { Sequelize } from "sequelize";

const CONFIG = {
	// 数据库
	DBNAME: process.env.MYSQL_DBNAME,
	// 用户名 (无用户名为空字符串)
	USERNAME: process.env.MYSQL_USER,
	// 密码 (无用户名为空字符串)
	PASSWORD: process.env.MYSQL_PASSWORD,
	// host
	HOST: process.env.MYSQL_HOST,
	// 端口
	PORT: process.env.MYSQL_PORT
};

const sequelize = new Sequelize({
	database: CONFIG.DBNAME,
	username: CONFIG.USERNAME,
	password: CONFIG.PASSWORD,
	host: CONFIG.HOST,
	dialect: "mysql",
	timezone: "+08:00",
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	logging: false,
	define: {
		hooks: {
			// beforeSave(options) {
			//     memoryCache.del(options.id);
			// },
			// beforeDestroy(options) {
			//     memoryCache.del(options.id);
			// }
		}
	}
});


async function connectionTest(){
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}

connectionTest();

sequelize.sync({
	force: false
});

export default sequelize;
