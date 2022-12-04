import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export class Common {

	@CreateDateColumn({ type: "timestamp" })
		createdDate!: Date;
	
	@UpdateDateColumn({ type: "timestamp" })
		updatedDate!: Date;
	
	@DeleteDateColumn({ type: "timestamp" })
		deletedDate: Date | undefined;
}
