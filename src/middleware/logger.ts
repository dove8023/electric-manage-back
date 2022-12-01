/*
 * @Author: Hearth 
 * @Date: 2022-11-29 16:54:23 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-01 19:34:05
 * @content what is the content of this file. */

import { Context, Next } from "koa";
import log4js, { LoggingEvent } from "log4js";
import dayjs from "dayjs";
import { DATA } from "src/interface";

log4js.addLayout("json", () => {
	return (logEvent: LoggingEvent) => {
		return JSON.stringify({
			app: process.env.APP_NAME,
			time: dayjs(logEvent.startTime).format("YYYY-MM-DD HH:mm:ss"),
			level: logEvent.level.levelStr,
			data: logEvent.data[0]
		});
	};
});

log4js.configure({
	appenders: {
		daily: {
			type: "dateFile",
			layout: {
				type: "json"
			},
			filename: `${process.env.LOGPATH}/${process.env.APP_NAME}`,
			pattern: "yyyy-MM-dd.log",
			alwaysIncludePattern: true,
			compress: true
		}
	},
	categories: {
		default: {
			appenders: ["daily"],
			level: "info"
		}
	}
});

const logger = log4js.getLogger("daily");

export default async function loggerMiddle(ctx: Context, next: Next) {
	ctx.logger = {
		info(data: DATA) {
			logger.info({ ...data, traceId: ctx.state.traceId });
		},
		warn(data: DATA) {
			logger.warn({ data, traceId: ctx.state.traceId });
		},
		error(data: DATA) {
			logger.error({ data, traceId: ctx.state.traceId });
		}
	};

	ctx.logger.info({
		type: "OUT",
		traceId: ctx.state.traceId,
		method: ctx.method,
		url: ctx.url,
		query: ctx.request.query,
		// body: ctx.request.body,
		ip: ctx.header["x-real_ip"],
		header: ctx.request.header
	});

	await next();
}
