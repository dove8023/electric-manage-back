import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Common } from "./Common";

@Entity()
export class SuperUser extends Common{

    @PrimaryGeneratedColumn("uuid")
    	id!: string;

    @Column({ type: "varchar", length: 50  })
    	username!: string | undefined;

    @Column({ type: "char", length: 32 })
    	password!: string;

	@Column({ type: "datetime" })
		lastLogin: string | undefined;
}
