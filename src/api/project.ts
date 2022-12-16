import { Context } from "koa";
import AppDataSource from "../common/db";
import { Restful, Router } from "../common/restful";
import { ContextCustomer, DATA } from "../interface";
import { Project, User } from "../entity";
import { formatRawData } from "../utils/index";
import { isString, isUUID, validate } from "class-validator";
import { Not, Equal } from "typeorm";

function projectColumnFilter(data: DATA){
	const result = formatRawData(data, ["project", "user"]);
	if(!result){
		return null;
	}

	const user = result.user as User;
	const project = result.project as Project;

	return {
		id: project.id,
		createdDate: project.createdDate,
		updatedDate: project.updatedDate,
		name: project.name,
		isDemo: project.isDemo,
		companyName: user.companyName,
		userName: user.name
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
		const result = await repository.createQueryBuilder("project")
			.leftJoinAndSelect(User, "user", "project.userId = user.id")
			.where("project.id = :id", { id })
			.getRawOne();

		if(!result){
			return ctx.error(202);
		}

		return ctx.success(projectColumnFilter(result));
	}

	async find(ctx: Context & ContextCustomer){
		const { page, size } = ctx.request.query;
		const isDemo = Boolean(ctx.request.query.isDemo);
		const pageNum = Number(page) || 0;
		let sizeNum = Number(size) || 20;
		if(sizeNum > 50){
			sizeNum = 50;
		}

		const repository = AppDataSource.getRepository(Project);		
		const result = await repository.createQueryBuilder("project")
			.leftJoinAndSelect(User, "user", "project.userId = user.id")
			.where("project.isDemo = :isDemo", { isDemo })
			.offset(sizeNum * pageNum)
			.limit(sizeNum)
			.getRawMany();

		ctx.success(result.map(item=>projectColumnFilter(item)));
	}

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

	/* search */


	/* remove demo project */
	async delete(ctx: Context & ContextCustomer){
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

		await AppDataSource.manager.softRemove(project);

		ctx.success("ok");
	}
}
