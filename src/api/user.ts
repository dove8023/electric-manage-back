import { Restful, Router } from "../common/restful";
import { ContextCustomer } from "../interface";

@Restful()
export class User {
	@Router("/hello", "get")
	good(ctx: ContextCustomer){
		ctx.success("hello");
	}
}
