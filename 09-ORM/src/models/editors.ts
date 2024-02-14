import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./games";

@Entity()
export class Editor {
    @PrimaryGeneratedColumn()
    public declare id: number;

    @Column({
        unique: true
    })
    public declare name: string;

    @OneToMany(() => Game, (game) => game.editor)
    public declare games: Game[];
}
