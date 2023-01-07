import { Context } from "koa";
import AppDataSource from "../common/db";
import validator from "validator";
import { Restful, Router } from "../common/restful";
import { ContextCustomer, PASSWORD_DEFAULT_LENGTH, STATE, USER_OPTION_TYPE } from "../interface";
import { User } from "../entity";
import { generatePassword } from "../utils/index";
import md5 from "md5";
import { isUUID, validate } from "class-validator";
import { Like } from "typeorm";

function userListFilter(item: User){
	return {
		id: item.id,
		createdDate: item.createdDate,
		email: item.email,
		name: item.name,
		state: item.state,
		tel: item.tel,
		companyName: item.companyName,
		address: item.address,
		remark: item.remark,
		lastLogin: item.lastLogin
	};
}

type CTX = Context & ContextCustomer;

@Restful()
export class UserController {
	@Router("/ping", "get")
	ping(ctx: ContextCustomer){
		ctx.success("pong");
	}

	async get(ctx: CTX){
		const { id } = ctx.request.params;
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

		return ctx.success(userListFilter(user));
	}

	async find(ctx: CTX){
		const { page, size } = ctx.request.query;
		const pageNum = Number(page) || 0;
		let sizeNum = Number(size) || 20;
		if(sizeNum > 50){
			sizeNum = 50;
		}

		const userRepository = AppDataSource.getRepository(User);		
		const [sqlResult, count] = await userRepository.findAndCount({
			skip: sizeNum * pageNum,
			take: sizeNum,
			order: {
				createdDate: "DESC"
			}
		});

		const result = sqlResult.map(userListFilter);

		ctx.success({
			count,
			list: result
		});
	}

	async post(ctx: CTX){
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
		user.state = true;

		const password = generatePassword(PASSWORD_DEFAULT_LENGTH);
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

	async put(ctx: CTX){
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

	@Router("/user/resetpwd/:id", "POST")
	async resetPassword(ctx: CTX){
		const { id } = ctx.request.params;
		const { type } = ctx.request.body;

		if(!isUUID(id)){
			return ctx.error(302);
		}

		if(type !== USER_OPTION_TYPE.RESETPASSWORD){
			return ctx.error(302);
		}

		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({
			id
		});

		if(!user){
			return ctx.error(202);
		}

		const password = generatePassword(PASSWORD_DEFAULT_LENGTH);

		user.password = md5(password);
		await AppDataSource.manager.save(user);

		ctx.success({
			password,
			email: user.email
		});
	}

	@Router("/user/changeState/:id", "POST")
	async changeState(ctx: CTX){
		const { id } = ctx.request.params;
		const { type, state } = ctx.request.body as {
			state : STATE,
			type: USER_OPTION_TYPE
		};

		if(!isUUID(id) || type !== USER_OPTION_TYPE.CHANGESTATE){
			return ctx.error(302);
		}

		let userState: boolean;
		switch (state) {
		case STATE.DISABLE:
			userState = false;
			break;
		case STATE.ENABLE:
			userState = true;
			break;
		
		default:
			return ctx.error(302);
		}

		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({
			id
		});

		if(!user){
			return ctx.error(202);
		}

		if(Boolean(user.state) === userState){
			return ctx.error(203);
		}

		user.state = userState;

		await AppDataSource.manager.save(user);

		ctx.success("ok");
	}

	@Router("/user/search", "GET")
	async search(ctx: CTX){
		const { keyword, page, size } = ctx.request.query;
		const pageNum = Number(page) || 0;
		let sizeNum = Number(size) || 20;
		if(sizeNum > 50){
			sizeNum = 50;
		}

		const userRepository = AppDataSource.getRepository(User);		
		const [sqlResult, count] = await userRepository.findAndCount({
			where: [
				{
					email: Like(`%${keyword}%`),
				},
				{ 
					companyName: Like(`%${keyword}%`),
				},
				{
					tel: Like(`%${keyword}%`),
				},
				{
					name: Like(`%${keyword}%`),
				}
			],
			skip: sizeNum * pageNum,
			take: sizeNum,
			order: {
				createdDate: "DESC"
			}
		});

		const result = sqlResult.map(userListFilter);

		ctx.success({
			count,
			list: result
		});
	}
}
