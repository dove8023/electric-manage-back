import md5 from "md5";
import isEmail from "validator/lib/isEmail";
import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";
import cache from "../common/cache";
import { SuperUser } from "../entity";
import AppDataSource from "../common/db";
import { Context } from "koa";

@Restful()
export class SuperUserController {

	@Router("/login", "post")
	async login(ctx: ContextCustomer & Context){
		let { username, password } = ctx.request.body;

		if(!username || !password){
			return ctx.error(301);
		}

		username = String(username);
		password = String(password);

		if(!isEmail(username) || password.length > 30){
			return ctx.error(302);
		}

		password = md5(password);

		const superUserModel = AppDataSource.getRepository(SuperUser);

		const result: SuperUser | null = await superUserModel.findOneBy({
			username,
			password
		});

		if(!result){
			return ctx.error(104);
		}

		const token = md5(Date.now() + result.id + Math.random());

		await cache.write(token, {
			userId: result.id,
			username: result.username
		}, 3600 * 8);

		return ctx.success(token);
	}
}
