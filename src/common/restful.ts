/*
 * @Author: Heath 
 * @Date: 2022-10-10 17:24:21 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-11-30 11:44:30
 * @content what is the content of this file. */


import KoaRouter from "koa-router";
import path from "node:path";

const allControlls: { [index: string]: any; } = {};
const DefaultMethod = ["get", "find", "post", "put", "delete"];


export function Restful(modelUrl?: string) {
	return function (target: any) {
		if (!modelUrl) {
			modelUrl = "/restful/" + target.name.replace(/Controller/, "");
		}
		allControlls[modelUrl] = target;
	};
}

export function Router(url: string, method = "get") {
	return function (target: any, propertyKey: string, desc: PropertyDescriptor) {
		const fn = desc.value;
		fn.$url = url;
		fn.$method = method.toLowerCase();
	};
}

export function RegisterRouter(router: KoaRouter) {
	for (const url in allControlls) {
		loadRouter(url, allControlls[url], router);
	}
}


function loadRouter(modelUrl: string, target: any, router: KoaRouter) {
	const apiHandle = Object.getOwnPropertyNames(target.prototype);
	console.log("===================");

	for (const item of DefaultMethod) {
		if (apiHandle.indexOf(item) < 0) {
			apiHandle.push(item);
		}
	}

	apiHandle.forEach((method: string) => {
		if (method == "constructor") {
			return;
		}

		const fn = target.prototype[method];
		if (typeof fn != "function") {
			return;
		}

		let url: string, httpMethod: string;
		switch (method) {
		case "get":
			url = path.join(modelUrl, "/:id");
			httpMethod = "get";
			break;
		case "find":
			url = modelUrl;
			httpMethod = "get";
			break;
		case "post":
			url = modelUrl;
			httpMethod = "post";
			break;
		case "put":
			url = path.join(modelUrl, "/:id");
			httpMethod = "put";
			break;
		case "delete":
			url = path.join(modelUrl, "/:id");
			httpMethod = "delete";
			break;
		default:
			if (fn.$url && fn.$method) {
				url = fn.$url;
				httpMethod = fn.$method;
			} else {
				return;
			}
		}

		url = url.toLowerCase();
		console.log("add router : ", httpMethod, url);
		switch (httpMethod) {
		case "get":
			router.get(url, fn.bind(target));
			break;
		case "post":
			router.post(url, fn.bind(target));
			break;
		case "put":
			router.put(url,fn.bind(target));
			break;
		case "delete":
			router.delete(url, fn.bind(target));
			break;
		default:
			return;
		}
	});
}
