import { Context } from "koa";
import AppDataSource from "../common/db";
import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";
import { Project } from "../entity";
import { checkSerialNumber, checkDeviceAttributes } from "../utils/index";
import { isBoolean, isString, isUUID, validate } from "class-validator";
import { Not, Equal } from "typeorm";

function projectColumnFilter(item: Project){
	return {
		id: item.id,
		createdDate: item.createdDate,
		updatedDate: item.updatedDate,
		serialNumber: item.name,
		zhName: item.desc,
		enName: item.deviceAttributes,
		attributes: item.elementAttributes,
		svg: item.userId,
		// companyName, userName
	};
}

@Restful()
export class ProjectController {

	async get(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		if(!isUUID(id)){
			return ctx.error(302);
		}

		const repository = AppDataSource.getRepository(Project);
		const project = await repository.findOneBy({
			id
		});

		if(!project){
			return ctx.error(202);
		}

		return ctx.success(projectColumnFilter(project));
	}

	async find(ctx: Context & ContextCustomer){
		const { page, size, isDemo = false } = ctx.request.query;
		const pageNum = Number(page) || 0;
		let sizeNum = Number(size) || 20;
		if(sizeNum > 50){
			sizeNum = 50;
		}

		if(!isBoolean(isDemo)){
			return ctx.error(302);
		}

		const repository = AppDataSource.getRepository(Project);		
		const sqlResult = await repository.find({
			where: {
				isDemo: Boolean(isDemo)
			},
			skip: sizeNum * pageNum,
			take: sizeNum,
			order: {
				createdDate: "DESC"
			}
		});

		const result = sqlResult.map(projectColumnFilter);

		ctx.success(result);
	}

	/* search */
 
	@Router("/project/saveAsDemo/:id", "POST")
	async saveAsDemo(ctx: Context & ContextCustomer){
		const { id } = ctx.request.params;
		const { name, desc } = ctx.request.body;

		if(!isUUID(id) || !name || !isString(name) || !desc || !isString(desc)){
			return ctx.error(302);
		}

		const demoProject = new Project();
		demoProject.name = name;
		demoProject.desc = desc;

		const errors = await validate(demoProject, {
			skipMissingProperties: true
		});

		if(errors.length){
			return ctx.error(302);
		}

		const repository = AppDataSource.getRepository(Project);
		const project = await repository.findOneBy({
			id
		});

		if(!project){
			return ctx.error(202);
		}

		demoProject.deviceId = project.deviceId;
		demoProject.deviceAttributes = project.deviceAttributes;
		demoProject.elementAttributes = project.elementAttributes;
		demoProject.userId = project.userId;
		demoProject.isDemo = true;

		await AppDataSource.manager.save(demoProject);

		ctx.success({
			id: demoProject.id
		});
	}

	/* remove demo project */
}
