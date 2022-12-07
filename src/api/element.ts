import { Context } from "koa";
import AppDataSource from "../common/db";
import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";
import { Element } from "../entity";
import { checkElementAttributes, checkSerialNumber } from "../utils/index";
import { isString, isUUID, validate } from "class-validator";
import { Like } from "typeorm";

@Restful()
export class ElementController {

	// async find(ctx: Context & ContextCustomer){
	// 	const { page, size } = ctx.request.query;
	// 	const pageNum = Number(page) || 0;
	// 	let sizeNum = Number(size) || 20;
	// 	if(sizeNum > 50){
	// 		sizeNum = 50;
	// 	}

	// 	const userRepository = AppDataSource.getRepository(User);		
	// 	const sqlResult = await userRepository.find({
	// 		skip: sizeNum * pageNum,
	// 		take: sizeNum,
	// 		order: {
	// 			createdDate: "DESC"
	// 		}
	// 	});

	// 	const result = sqlResult.map(userListFilter);

	// 	ctx.success(result);
	// }

	async post(ctx: Context & ContextCustomer){
		const { serialNumber, zhName, enName, attributes } = ctx.request.body;

		if(!serialNumber || !zhName || !isString(zhName) || !attributes || !Array.isArray(attributes)){
			return ctx.error(302);
		}

		if(enName || !isString(enName)){
			return ctx.error(302);
		}

		if(!checkSerialNumber(serialNumber)){
			return ctx.error(601);
		}

		const checkedAttributes = checkElementAttributes(attributes);
		if(!checkedAttributes){
			return ctx.error(602);
		}

		const element = new Element();
		element.serialNumber = serialNumber;
		element.zhName = zhName;
		element.enName = enName;
		element.attributes = checkedAttributes;
		
		const errors = await validate(element, {
			skipMissingProperties: true
		});

		if(errors.length){
			return ctx.error(302);
		}
		
		const hasElement = await AppDataSource.manager.findOneBy(Element, {
			serialNumber
		});

		if(hasElement){
			return ctx.error(600);
		}

		await AppDataSource.manager.save(element);

		ctx.success({
			id: element.id,
		});
	}

	// async put(ctx: Context & ContextCustomer){
	// 	const { id } = ctx.request.params;
	// 	const { name, tel, companyName, address, remark } = ctx.request.body;
	// 	if(!isUUID(id)){
	// 		return ctx.error(302);
	// 	}

	// 	const userRepository = AppDataSource.getRepository(User);
	// 	const user = await userRepository.findOneBy({
	// 		id
	// 	});

	// 	if(!user){
	// 		return ctx.error(202);
	// 	}

	// 	user.name = name || user.name;
	// 	user.tel = tel || user.tel;
	// 	user.companyName = companyName || user.companyName;
	// 	user.address = address || user.address;
	// 	user.remark = remark || user.remark;

	// 	const errors = await validate(user, {
	// 		skipMissingProperties: true
	// 	});

	// 	if(errors.length){
	// 		return ctx.error(302);
	// 	}

	// 	await AppDataSource.manager.save(user);

	// 	ctx.success("ok");
	// }

	// @Router("/user/resetpwd/:id", "POST")
	// async resetPassword(ctx: Context & ContextCustomer){
	// 	const { id } = ctx.request.params;
	// 	const { type } = ctx.request.body;

	// 	if(!isUUID(id)){
	// 		return ctx.error(302);
	// 	}

	// 	if(type !== USER_OPTION_TYPE.RESETPASSWORD){
	// 		return ctx.error(302);
	// 	}

	// 	const userRepository = AppDataSource.getRepository(User);
	// 	const user = await userRepository.findOneBy({
	// 		id
	// 	});

	// 	if(!user){
	// 		return ctx.error(202);
	// 	}

	// 	const password = generatePassword(PASSWORD_DEFAULT_LENGTH);

	// 	user.password = md5(password);
	// 	await AppDataSource.manager.save(user);

	// 	ctx.success({
	// 		password,
	// 		email: user.email
	// 	});
	// }

	// @Router("/user/changeState/:id", "POST")
	// async changeState(ctx: Context & ContextCustomer){
	// 	const { id } = ctx.request.params;
	// 	const { type, state } = ctx.request.body as {
	// 		state : USER_STATE,
	// 		type: USER_OPTION_TYPE
	// 	};

	// 	if(!isUUID(id)){
	// 		return ctx.error(302);
	// 	}

	// 	if(type !== USER_OPTION_TYPE.CHANGESTATE){
	// 		return ctx.error(302);
	// 	}

	// 	switch (state) {
	// 	case USER_STATE.DISABLE:
	// 	case USER_STATE.ENABLE:
	// 		break;
	// 	default:
	// 		return ctx.error(302);
	// 	}

	// 	const userRepository = AppDataSource.getRepository(User);
	// 	const user = await userRepository.findOneBy({
	// 		id
	// 	});

	// 	if(!user){
	// 		return ctx.error(202);
	// 	}

	// 	user.state = state;

	// 	await AppDataSource.manager.save(user);

	// 	ctx.success("ok");
	// }

	// @Router("/user/search", "GET")
	// async search(ctx: Context & ContextCustomer){
	// 	const { keyword, page, size } = ctx.request.query;
	// 	const pageNum = Number(page) || 0;
	// 	let sizeNum = Number(size) || 20;
	// 	if(sizeNum > 50){
	// 		sizeNum = 50;
	// 	}

	// 	const userRepository = AppDataSource.getRepository(User);		
	// 	const sqlResult = await userRepository.find({
	// 		where: [
	// 			{
	// 				email: Like(`%${keyword}%`),
	// 			},
	// 			{ 
	// 				companyName: Like(`%${keyword}%`),
	// 			},
	// 			{
	// 				tel: Like(`%${keyword}%`),
	// 			},
	// 			{
	// 				name: Like(`%${keyword}%`),
	// 			}
	// 		],
	// 		skip: sizeNum * pageNum,
	// 		take: sizeNum,
	// 		order: {
	// 			createdDate: "DESC"
	// 		}
	// 	});

	// 	const result = sqlResult.map(userListFilter);

	// 	ctx.success(result);
	// }
}
