import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public declare id: number;

    @Column()
    public declare name: string;

    @Column()
    public declare password: string;
}