import "reflect-metadata";
import { DataSource } from "typeorm";
import { SuperUser, User, Element } from "../entity";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.MYSQL_HOST,
	port: Number(process.env.MYSQL_PORT) || 3306,
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DBNAME,
	synchronize: true,
	logging: false,
	entities: [SuperUser, User, Element],
	migrations: [],
	subscribers: [],
});

AppDataSource.initialize().then(async ()=>{
	console.log("Database connect success.");

	// const result = AppDataSource.getRepository(SuperUser).create({
	// 	username: "admin@tc.com",
	// 	password: "e10adc3949ba59abbe56e057f20f883e",
	// 	lastLogin: dayjs().format("YYYY-MM-DD HH:mm:ss")
	// });

	// await AppDataSource.manager.save(result);

}).catch((err)=>{
	console.log("Error database connect error: ",err);
});

export default AppDataSource;
