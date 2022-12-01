import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";

@Restful()
export class SuperUser {

	@Router("/hello2", "post")
	testGet(ctx: ContextCustomer){
		ctx.success("hello2");
	}
	
	@Router("/login", "post")
	login(ctx: ContextCustomer){
		console.log(11111111, ctx.url, ctx);
		const { username, password } = ctx.request.body;
		
		// ctx.response.body = "abcdefg";
		return ctx.success(username + password);
	}
}
