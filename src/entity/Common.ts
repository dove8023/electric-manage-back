import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class Common {
	@PrimaryGeneratedColumn("uuid")
		id!: string;

	@CreateDateColumn({ type: "timestamp" })
		createdDate!: Date;
	
	@UpdateDateColumn({ type: "timestamp" })
		updatedDate!: Date;
	
	@DeleteDateColumn({ type: "timestamp" })
		deletedDate: Date | undefined;
}
