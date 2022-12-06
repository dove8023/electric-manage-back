import { Entity,  Column } from "typeorm";
import { Common } from "./Common";
import { ELEMENT_ATTRIBUTE } from "../interface";
import {
	Length,
} from "class-validator";


@Entity()
export class Element extends Common{

    @Column({ type: "varchar", length: 50, unique: true  })
    	serialNumber!: string;

    @Column({ type: "varchar", length: 50 })
	@Length(1, 50)
    	zhName!: string;

	@Column({ type: "varchar", length: 50, nullable: true })
	@Length(1, 50)
		enName: string | undefined;

	@Column({ type: "json" })
		attributes!: ELEMENT_ATTRIBUTE[];
}
