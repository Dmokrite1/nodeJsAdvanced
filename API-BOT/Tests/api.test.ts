import { Server } from "http";
import { initApi } from "../Api";
import { config } from "dotenv";
import { DatabaseConnection } from "../Core/Database/connection";
import { seedForTesting } from "./seed-for-testing";

let api: Server;

beforeEach(async () => {
    config({
        path: 'test.env'
    });
    await DatabaseConnection.init();
    await seedForTesting();
    api = initApi();
});

it('Returns 404 on unknown route', async () => {
    const req = await fetch('http://localhost:8081');
    expect(req.status).toStrictEqual(404);
});

const USERS_URL = 'http://localhost:8081/users/';

it('Returns Unauthorized when not authentication method is provided', async () => {
    const req = await fetch(USERS_URL);
    const json = await req.text();
    expect(req.status).toStrictEqual(401);
    expect(json).toStrictEqual('Unauthorized');
});

it('Returns the list of users when authenticated', async () => {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aW1teSIsImlhdCI6MjUxNjIzOTAyMn0.ADefHVnZdjM3x75l6s5hD6E3-v5oR2_4rhltNlGuYCA';
    const user = await fetch(USERS_URL, {
        credentials: 'include',
        headers: {
            Cookie: 'accessToken=' + accessToken
        }
    });

    expect(user.status).toStrictEqual(200);

    const userList = await user.json();

    expect(userList).toMatchInlineSnapshot(`
[
  {
    "firstName": "Loutre",
    "id": "timmy",
    "lastName": "Banane",
    "password": "sjflkdjsflkdj",
    "role": "Admin",
    "username": "Dramix",
  },
]
`);
    
});

afterEach(async () => {
    await DatabaseConnection.closeConnection();
    api.close();
});