import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Sound } from "./sounds";

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    public declare id: string;

    @Column({
        unique: true,
        length: 32
    })
    public declare name: string;

    @OneToMany(() => Sound, (sound) => sound.category)
    public declare sounds: Sound[];
}