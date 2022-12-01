/*
 * @Author: Hearth 
 * @Date: 2022-11-26 23:00:07 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-11-30 11:25:48
 * @content what is the content of this file. */

import http from "node:http";
import { chmodSync } from "node:fs";
import app from "./common/http";
import KoaRouter from "koa-router";
import { RegisterRouter } from "./common/restful";

import "./api/user";

const router = new KoaRouter();
RegisterRouter(router);
app.use(router.routes());

const server = http.createServer(app.callback());

const PORT = process.env.API_PORT || "3000";


server.on("listening", function () {
	if (!/^\d+$/.test(PORT)) {
		chmodSync(PORT, "777");
	}
});

server.listen(PORT, () => {
	console.log("http server is running at: ", PORT);
});

process.on("unhandledRejection", (reason) => {
	console.error("unhandledRejection", reason);
});

process.on("uncaughtException", (err) => {
	console.error("uncaughtException==>", err.stack ? err.stack : err);
});
