// Import des modules TypeORM
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, type ValueTransformer } from "typeorm";
import { Editor } from "./editors";
import { Platform } from "./platform";

// Définir un enum pour les différents types de jeux vidéo
export enum GameType {
    MMORPG = 'MMORPG',
    RPG = 'RPG',
    FPS = 'FPS',
    PLATFORMER = 'PLATFORMER',
    RTS = 'RTS',
    SIMULATION = 'SIMULATION',
    FANTASY = 'FANTASY'
}

export class DecimalTransformer implements ValueTransformer {
    to(decimal?: number): number | undefined {
        return decimal;
    }

    from(decimal?: string): number | undefined {
        return (decimal != null) ? parseFloat(decimal) : undefined;
    }
}
// Déclarer une entité Game pour la base de données
@Entity()
export class Game {
    // Clé primaire auto-générée
    @PrimaryGeneratedColumn()
    public declare id: number;

    // Titre du jeu, chaîne de caractères avec une longueur maximale de 150 caractères
    @Column({
        length: 150,
        unique: true
    })
    public declare title: string;

    // Prix du jeu, de type décimal avec une précision de 2 chiffres après la virgule
    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true
    })
    public declare price?: number;

    // Date de sortie du jeu, de type date
    @Column({
        type: 'date'
    })
    public declare releaseDate: Date;

    // Genre du jeu, de type enum avec les valeurs définies dans l'enum GameType
    @Column({
        type: 'set',
        enum: Object.values(GameType)
    })
    public declare genre: GameType[];

    // Note attribuée au jeu, de type décimal avec une précision de 1 chiffre après la virgule
    @Column({
        type: 'decimal',
        precision: 3,
        scale: 1
    })
    public declare note: number;

    @ManyToOne(() => Editor, (editor) => editor.games)
    public declare editor: Editor;

    @ManyToMany(() => Platform, (platform) => platform.games)
    @JoinTable()
    public declare platforms: Platform[];
}
