import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    ADMIN = "Admin",
    USER = "User"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    public declare id: string;
    
    @Column({
        unique: true,
        type: 'string'
    })
    public declare username: string;

    @Column({
        length: 32,
        type: 'string'
    })
    public declare firstName: string;

    @Column({
        length: 32,
        type: 'string'
    })
    public declare lastName: string;

    @Column({
        length: 60,
        type: 'string'
    })
    public declare password: string;

    @Column({
        type: 'enum',
        enum: Object.values(Role)
    })
    public declare role: Role;
}