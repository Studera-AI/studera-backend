import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @ObjectIdColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;
}
