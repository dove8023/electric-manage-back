import { Context } from "koa";
import AppDataSource from "../common/db";
import validator from "validator";
import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";
import { User } from "../entity";
import { generatePassword } from "../utils/index";
import md5 from "md5";
import { isUUID, validate } from "class-validator";

@Restful()
export class UserController {
	@Router("/ping", "get")
	ping(ctx: ContextCustomer){
		ctx.success("pong");
	}

	async find(ctx: Context & ContextCustomer){
		const { page, size } = ctx.request.query;
		const pageNum = Number(page) || 0;
		let sizeNum = Number(size) || 20;
		if(sizeNum > 50){
			sizeNum = 50;
		}

		const userRepository = AppDataSource.getRepository(User);		
		const sqlResult = await userRepository.find({
			skip: sizeNum * pageNum,
			take: sizeNum,
			order: {
				createdDate: "DESC"
			}
		});

		const result = sqlResult.map((item)=>{
			return {
				id: item.id,
				createdDate: item.createdDate,
				email: item.email,
				name: item.name,
				tel: item.tel,
				companyName: item.companyName,
				address: item.address,
				remark: item.remark,
				lastLogin: item.lastLogin
			};
		});

		ctx.success(result);
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
			password,
			email
		});
	}

	async put(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		const { name, tel, companyName, address, remark } = ctx.request.body;
		if(!isUUID(id)){
			return ctx.error(302);
		}

		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({
			id
		});

		if(!user){
			return ctx.error(202);
		}

		user.name = name || user.name;
		user.tel = tel || user.tel;
		user.companyName = companyName || user.companyName;
		user.address = address || user.address;
		user.remark = remark || user.remark;

		const errors = await validate(user, {
			skipMissingProperties: true
		});

		if(errors.length){
			return ctx.error(302);
		}

		await AppDataSource.manager.save(user);

		ctx.success("ok");
	}

	/* 重置密码 */

	/* 启用、禁用用户 */

	/* 搜索用户 */
}
