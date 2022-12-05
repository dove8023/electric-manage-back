import { Context } from "koa";
import AppDataSource from "../common/db";
import validator from "validator";
import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";
import { User } from "../entity";
import { generatePassword } from "../utils/index";
import md5 from "md5";
import { validate } from "class-validator";

@Restful()
export class UserController {
	@Router("/ping", "get")
	good(ctx: ContextCustomer){
		ctx.success("pong");
	}

	async post(ctx: Context & ContextCustomer){
		const { email, name, tel, companyName, address, remark } = ctx.request.body;

		if(!email || !validator.isEmail(email)){
			return ctx.error(302);
		}

		const checkUser = await AppDataSource.manager.findOneBy(User, {
			email
		});

		if(checkUser){
			return ctx.error(550);
		}

		const user = new User();
		user.email = email;
		user.name = name;
		user.tel = tel;
		user.companyName = companyName;
		user.address = address;
		user.remark = remark;

		const password = generatePassword(15);
		user.password = md5(password);

		const errors = await validate(user, {
			skipMissingProperties: true
		});

		if(errors.length){
			return ctx.error(302);
		}

		await AppDataSource.manager.save(user);

		ctx.success({
			userId: user.id,
			password
		});
	}
}
