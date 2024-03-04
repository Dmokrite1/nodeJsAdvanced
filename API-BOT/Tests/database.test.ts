import { config } from "dotenv";
import { DatabaseConnection } from "../Core/Database/connection";
import { getUserById } from "../Core/Database/users";

it('fetch users', async () => {
    config({
        path: 'development.env'
    });
    await DatabaseConnection.init();
    const user = await getUserById('1')
})