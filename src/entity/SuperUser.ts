import { Entity, Column } from "typeorm";
import { Common } from "./Common";

@Entity()
export class SuperUser extends Common{

    @Column({ type: "varchar", length: 50, unique: true  })
    	username!: string | undefined;

    @Column({ type: "char", length: 32 })
    	password!: string;

	@Column({ type: "datetime" })
		lastLogin: string | undefined;
}
