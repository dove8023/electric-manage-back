import { Entity,  Column } from "typeorm";
import { Common } from "./Common";
import { DEVICE_ATTRIBUTE } from "../interface";
import {
	Length,
} from "class-validator";


@Entity()
export class Device extends Common{

    @Column({ type: "varchar", length: 50, unique: true  })
    	serialNumber!: string;

	@Column({ type: "tinyint" })
		state!: boolean;

    @Column({ type: "varchar", length: 50, unique: true })
	@Length(1, 50)
    	zhName!: string;

	@Column({ type: "varchar", length: 50, nullable: true })
	@Length(1, 50)
		enName: string | undefined;

	@Column({ type: "json" })
		attributes!: DEVICE_ATTRIBUTE[];

	@Column({ type: "longtext" })
		svg!: string;
}
