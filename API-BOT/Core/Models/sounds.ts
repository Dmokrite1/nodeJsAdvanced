import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./categories";

@Entity()
export class Sound {
    @PrimaryGeneratedColumn("uuid")
    public declare id: string;
    
    @Column({
        length: 64,
        unique: true
    })
    public declare name: string;

    @Column({
        length: 260
    })
    public declare file: string;

    @ManyToOne(() => Category, (cat) => cat.sounds)
    public declare category: Category;
}