import { Context } from "koa";
import AppDataSource from "../common/db";
import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";
import { Element } from "../entity";
import { checkElementAttributes, checkSerialNumber } from "../utils/index";
import { isString, isUUID, validate } from "class-validator";
import { Not, Equal, Like } from "typeorm";

function elementListFilter(item: Element){
	return {
		id: item.id,
		createdDate: item.createdDate,
		updatedDate: item.updatedDate,
		serialNumber: item.serialNumber,
		zhName: item.zhName,
		enName: item.enName,
		attributes: item.attributes,
	};
}

@Restful()
export class ElementController {

	async get(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		if(!isUUID(id)){
			return ctx.error(302);
		}

		const repository = AppDataSource.getRepository(Element);
		const element = await repository.findOneBy({
			id
		});

		if(!element){
			return ctx.error(202);
		}

		return ctx.success(elementListFilter(element));
	}

	async find(ctx: Context & ContextCustomer){
		const { page, size, keyword } = ctx.request.query;
		const pageNum = Number(page) || 0;
		let sizeNum = Number(size) || 20;
		if(sizeNum > 50){
			sizeNum = 50;
		}

		if(keyword && keyword.length > 30){
			return ctx.error(302);
		}

		const elementRepository = AppDataSource.getRepository(Element);
		const option: any = {
			skip: sizeNum * pageNum,
			take: sizeNum,
			order: {
				createdDate: "DESC"
			}
		};

		if(keyword){
			option.where = [
				{
					serialNumber: Like(`%${keyword}%`),
				},
				{ 
					zhName: Like(`%${keyword}%`),
				}
			];
		}

		const [sqlResult, count] = await elementRepository.findAndCount(option);

		const result = sqlResult.map(elementListFilter);

		ctx.success({
			count,
			list: result
		});
	}

	async post(ctx: Context & ContextCustomer){
		const { serialNumber, zhName, enName, attributes } = ctx.request.body;

		if(!serialNumber || !zhName || !isString(zhName) || !attributes || !Array.isArray(attributes)){
			return ctx.error(302);
		}

		if(enName && !isString(enName)){
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
		
		const hasElementBySerialNumber = await AppDataSource.manager.findOneBy(Element, {
			serialNumber
		});

		if(hasElementBySerialNumber){
			return ctx.error(600);
		}

		const hasElementByName = await AppDataSource.manager.findOneBy(Element, {
			zhName
		});

		if(hasElementByName){
			return ctx.error(603);
		}

		await AppDataSource.manager.save(element);

		ctx.success({
			id: element.id,
		});
	}

	async put(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		const { zhName, enName, attributes } = ctx.request.body;

		if(!isUUID(id)){
			return ctx.error(302);
		}

		if(!zhName || !isString(zhName) || !attributes || !Array.isArray(attributes)){
			return ctx.error(302);
		}

		if(enName && !isString(enName)){
			return ctx.error(302);
		}

		const checkedAttributes = checkElementAttributes(attributes);
		if(!checkedAttributes){
			return ctx.error(602);
		}

		const elementRepository = AppDataSource.getRepository(Element);
		const element = await elementRepository.findOneBy({
			id
		});

		if(!element){
			return ctx.error(202);
		}

		element.zhName = zhName;
		element.enName = enName || element.enName;
		element.attributes = checkedAttributes;

		const errors = await validate(element, {
			skipMissingProperties: true
		});

		if(errors.length){
			return ctx.error(302);
		}

		const hasElementByName = await AppDataSource.manager.findOneBy(Element, {
			zhName,
			id: Not(Equal(element.id))
		});

		if(hasElementByName){
			return ctx.error(603);
		}

		await AppDataSource.manager.save(element);

		ctx.success({
			id: element.id,
		});
	}

	@Router("/element/isExist", "POST")
	async checkExistBySerialNumber(ctx: Context & ContextCustomer){
		const { serials } = ctx.request.body;

		if(!Array.isArray(serials)){
			return ctx.error(302);
		}

		const checkResult = serials.map(item=>checkSerialNumber(item));
		if(checkResult.indexOf(false) > -1){
			return ctx.error(610);
		}

		if(serials.length > 20){
			return ctx.error(611);
		}

		const ps = serials.map(async (serialNumber)=>{
			const element = await AppDataSource.manager.findOneBy(Element, {
				serialNumber: serialNumber.toString()
			});

			return {
				serialNumber,
				isExist: !!element,
				zhName: element?.zhName
			};
		});

		const result = await Promise.all(ps);

		ctx.success(result);
	}
}
