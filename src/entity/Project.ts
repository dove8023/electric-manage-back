import { Entity,  Column } from "typeorm";
import { Common } from "./Common";
import { PROJECT_ATTRIBUTE } from "../interface";
import {
	Length,
} from "class-validator";

@Entity()
export class Project extends Common{

    @Column("uuid")
    	userId!: string;

	@Column("uuid")
    	deviceId!: string;

    @Column({ type: "varchar", length: 50, unique: true })
	@Length(1, 50)
    	name!: string;

	@Column({ type: "tinyint", default: false })
		isDemo!: boolean;

	@Column({ type: "varchar", length: 255, nullable: true })
	@Length(1, 255)
		desc: string | undefined;

	@Column({ type: "json" })
		deviceAttributes!: PROJECT_ATTRIBUTE[];

	@Column({ type: "json" })
		elementAttributes!: PROJECT_ATTRIBUTE[];
}
