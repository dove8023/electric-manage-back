import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";

@Restful()
export class User {
	@Router("/hello", "post")
	good(ctx: ContextCustomer){
		ctx.success("hello");
	}
}
