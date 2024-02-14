import { EntityManager } from "typeorm";
import { Role, User } from "../Models/users";
import { Category } from "../Models/categories";
import { DatabaseConnection } from "./connection";

export async function seeder() {
    const manager = DatabaseConnection.manager;

    const users = manager.create(User, [{
        firstName: 'Dramix',
        lastName: 'Otter',
        username: 'romain',
        role: Role.ADMIN,
        // mot de passe HASHE (potato)
        password: '$2b$12$TS7w9XaC7BEe4njDbI6Uye90X4BO7Pb7zZGa9zDuN20Lw/WuKJQ9C'
    }, {
        firstName: 'Seb',
        lastName: 'Caudron',
        role: Role.USER,
        username: 'remadex',
        // mot de passe HASHE (potato)
        password: '$2b$12$TS7w9XaC7BEe4njDbI6Uye90X4BO7Pb7zZGa9zDuN20Lw/WuKJQ9C'
    }]);

    const categories = manager.create(Category, [
        {
            name: 'Troll'
        },
        {
            name: 'Pet'
        },
        {
            name: 'Animaux'
        },
        {
            name: 'Meme'
        },
        {
            name: 'Anime'
        },
        {
            name: 'Movie'
        },
        {
            name: 'NSFW'
        }
    ]);

    await manager.save(categories);
    await manager.save(users);
}