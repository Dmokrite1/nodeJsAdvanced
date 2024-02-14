import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./games";

@Entity()
export class Platform {
    @PrimaryGeneratedColumn()
    public declare id: number;

    @Column({
        unique: true
    })
    public declare name: string;

    @ManyToMany(() => Game, (game) => game.platforms)
    public declare games: Game[];
}
