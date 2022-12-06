import { Entity,  Column } from "typeorm";
import { Common } from "./Common";
import { USER_STATE } from "../interface";
import {
	Length,
	IsEmail,
	MaxLength,
	IsEnum
} from "class-validator";


@Entity()
export class User extends Common{

    @Column({ type: "varchar", length: 50, unique: true  })
	@IsEmail()
    	email!: string;

    @Column({ type: "char", length: 32 })
	@Length(32, 32)
    	password!: string;

	@Column({ type: "varchar", length: 7 })
	@IsEnum(USER_STATE)
		state!: string;

	@Column({ type: "varchar", length: 50, nullable:true })
	@MaxLength(50)
		name: string | undefined;

	@Column({ type: "varchar", length: 20, nullable:true })
	@MaxLength(20)
		tel: string | undefined;

	@Column({ type: "varchar", length: 50, nullable:true })
	@MaxLength(50)
		companyName: string | undefined;

	@Column({ type: "varchar", length: 255, nullable:true })
	@MaxLength(255)
		address: string | undefined;

	@Column({ type: "varchar", length: 255, nullable:true })
	@MaxLength(255)
		remark: string | undefined;

	@Column({ type: "datetime", nullable:true })
		lastLogin: string | undefined;

}
