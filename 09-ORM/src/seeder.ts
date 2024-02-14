import { type EntityManager } from "typeorm";
import { Game, GameType } from "./models/games";
import { Platform } from "./models/platform";
import { Editor } from "./models/editors";

export async function seedDatabase(manager: EntityManager) {
    const platforms = manager.create(
        Platform,
        [
            { name: 'PC master race' },
            { name: 'PlayStation' },
            { name: 'XBOX' },
            { name: 'Gameboy' }
        ]
    );
    await manager.save(platforms);

    const editors = manager.create(
        Editor,
        [
            { name: 'Microsoft' },
            { name: 'Black Isle Studio' },
            { name: 'CD Projekt' },
            { name: 'Rockstar Games' },
            { name: '3dO' },
            { name: 'Nintendo' },
            { name: 'Valve Software' }
        ]
    );
    await manager.save(editors);

    const [PCMasterRace, Playstation, XBOX] = platforms;
    const [, Microsoft, BlackIsle, Rockstar, Valve] = editors;

    const games = manager.create(
        Game,
        [
            {
                title: 'World of Warcraft: The Burning Crusade',
                genre: [GameType.MMORPG, GameType.FANTASY],
                releaseDate: new Date('2004-11-23'),
                note: 95.4,
                platforms: [PCMasterRace],
                editor: Rockstar
            },
            {
                title: 'Counter Strike',
                genre: [GameType.FPS],
                releaseDate: new Date('2000-11-09'),
                note: 50.2,
                platforms: [PCMasterRace],
                editor: Valve
            },
            {
                title: 'Fortnite',
                genre: [GameType.FPS],
                releaseDate: new Date('2017-07-21'),
                note: 65.3,
                platforms: [PCMasterRace, Playstation, XBOX],
                editor: Microsoft
            },
            {
                title: 'Age of Empire',
                genre: [GameType.RTS],
                releaseDate: new Date('1997-10-13'),
                note: 68.0,
                platforms: [PCMasterRace],
                editor: BlackIsle
            }
        ]
    );
    await manager.save(games);
}
