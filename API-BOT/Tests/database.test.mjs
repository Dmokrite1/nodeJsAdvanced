import { it } from "vitest";
import { getUserById } from "../Core/Database/users";
import 'reflect-metadata';
import { DatabaseConnection } from "../Core/Database/connection";
import { config } from "dotenv";

it('Fetch user by id from database', async () => {
    config({
        path: 'development.env'
    });
    await DatabaseConnection.init();
    const user = await getUserById('1');
    console.log(user);
});