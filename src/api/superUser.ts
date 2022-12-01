import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";

@Restful()
export class SuperUser {

	@Router("/login", "post")
	login(ctx: ContextCustomer){
		const { username, password } = ctx.request.body as any;

		return ctx.success(username + password);
	}
}
