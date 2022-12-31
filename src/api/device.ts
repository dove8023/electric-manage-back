import { Context } from "koa";
import AppDataSource from "../common/db";
import { Restful, Router } from "../common/restful";
import { ContextCustomer, STATE } from "../interface";
import { Device } from "../entity";
import { checkSerialNumber, checkDeviceAttributes } from "../utils/index";
import { isString, isUUID, validate } from "class-validator";
import { Not, Equal } from "typeorm";

function deviceListFilter(item: Device){
	return {
		id: item.id,
		createdDate: item.createdDate,
		updatedDate: item.updatedDate,
		serialNumber: item.serialNumber,
		zhName: item.zhName,
		enName: item.enName,
		attributes: item.attributes,
		svg: item.svg
	};
}

@Restful()
export class DeviceController {

	async get(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		if(!isUUID(id)){
			return ctx.error(302);
		}

		const repository = AppDataSource.getRepository(Device);
		const device = await repository.findOneBy({
			id
		});

		if(!device){
			return ctx.error(202);
		}

		return ctx.success(deviceListFilter(device));
	}

	async find(ctx: Context & ContextCustomer){
		const { page, size } = ctx.request.query;
		const pageNum = Number(page) || 0;
		let sizeNum = Number(size) || 20;
		if(sizeNum > 50){
			sizeNum = 50;
		}

		const repository = AppDataSource.getRepository(Device);		
		const [sqlResult, count] = await repository.findAndCount({
			skip: sizeNum * pageNum,
			take: sizeNum,
			order: {
				createdDate: "DESC"
			}
		});

		const result = sqlResult.map(deviceListFilter);

		ctx.success({
			count,
			list: result
		});
	}

	async post(ctx: Context & ContextCustomer){
		const { serialNumber, zhName, enName, attributes, svg } = ctx.request.body;

		if(!serialNumber || !zhName || !isString(zhName) || !attributes || !Array.isArray(attributes)){
			return ctx.error(302);
		}

		if(!svg || !isString(svg)){
			return ctx.error(650);
		}

		if(enName && !isString(enName)){
			return ctx.error(302);
		}

		if(!checkSerialNumber(serialNumber)){
			return ctx.error(601);
		}

		const checkedAttributes = checkDeviceAttributes(attributes);
		if(!checkedAttributes){
			return ctx.error(602);
		}

		const device = new Device();
		device.serialNumber = serialNumber;
		device.zhName = zhName;
		device.enName = enName;
		device.attributes = checkedAttributes;
		device.svg = svg;
		device.state = true;

		const errors = await validate(device, {
			skipMissingProperties: true
		});

		if(errors.length){
			return ctx.error(302);
		}
		
		const hasDeviceBySerialNumber = await AppDataSource.manager.findOneBy(Device, {
			serialNumber
		});

		if(hasDeviceBySerialNumber){
			return ctx.error(600);
		}

		const hasDeviceByName = await AppDataSource.manager.findOneBy(Device, {
			zhName
		});

		if(hasDeviceByName){
			return ctx.error(603);
		}

		await AppDataSource.manager.save(device);

		ctx.success({
			id: device.id,
		});
	}

	async put(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		const { zhName, enName, attributes, svg } = ctx.request.body;

		if(!isUUID(id)){
			return ctx.error(302);
		}

		if(!zhName || !isString(zhName) || !attributes || !Array.isArray(attributes)){
			return ctx.error(302);
		}

		if(enName && !isString(enName)){
			return ctx.error(302);
		}

		if(!svg || !isString(svg)){
			return ctx.error(650);
		}

		const checkedAttributes = checkDeviceAttributes(attributes);
		if(!checkedAttributes){
			return ctx.error(602);
		}

		const repository = AppDataSource.getRepository(Device);
		const device = await repository.findOneBy({
			id
		});

		if(!device){
			return ctx.error(202);
		}

		device.zhName = zhName;
		device.enName = enName || device.enName;
		device.attributes = checkedAttributes;
		device.svg = svg;

		const errors = await validate(device, {
			skipMissingProperties: true
		});

		if(errors.length){
			return ctx.error(302);
		}

		const hasDeviceByName = await AppDataSource.manager.findOneBy(Device, {
			zhName,
			id: Not(Equal(device.id))
		});

		if(hasDeviceByName){
			return ctx.error(603);
		}

		await AppDataSource.manager.save(device);

		ctx.success({
			id: device.id,
		});
	}

	@Router("/device/changeState/:id", "POST")
	async changeState(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		const { state } = ctx.request.body as {
			state : STATE,
		};

		if(!isUUID(id) || !state){
			return ctx.error(302);
		}

		let deviceState: boolean;
		switch (state) {
		case STATE.DISABLE:
			deviceState = false;
			break;
		case STATE.ENABLE:
			deviceState = true;
			break;
		default:
			return ctx.error(302);
		}

		const repository = AppDataSource.getRepository(Device);
		const device = await repository.findOneBy({
			id
		});

		if(!device){
			return ctx.error(202);
		}

		if(Boolean(device.state) === deviceState){
			return ctx.error(203);
		}

		device.state = deviceState;

		await AppDataSource.manager.save(device);

		ctx.success("ok");
	}
}
