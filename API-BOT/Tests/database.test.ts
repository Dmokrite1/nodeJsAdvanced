import { config } from "dotenv";
import { DatabaseConnection } from "../Core/Database/connection";
import { deleteUser, getUserById, insertUser } from "../Core/Database/users";
import { Role, User } from "../Core/Models/users";
import { EntityNotFoundError } from "../Api/Errors/entity-not-found.error";
import { seedForTesting } from "./seed-for-testing";

beforeEach(async () => {
    config({
        path: 'test.env'
    });
    await DatabaseConnection.init();
    await seedForTesting();
});

it('fetch users', async () => {
    const user = await getUserById('timmy');
    expect(user).toHaveProperty('firstName', 'Loutre');
});

it('throws an EntityNotFoundError when no User is found', async () => {
    await expect(() => getUserById('does-not-exists')).rejects.toThrow(EntityNotFoundError);
});

it('Should insert User into database', async () => {
    const user = await insertUser({
        username: 'LePetit',
        lastName: 'greg',
        firstName: 'banane',
        password: '',
        role: Role.USER
    });

    expect(user).toBeInstanceOf(User);
    
    const isInDatabase = await DatabaseConnection.getConnection().getRepository(User).exists({
        where: {
            username: 'LePetit'
        }
    })

    expect(isInDatabase).toBe(true);
});

it('Should delete User in database', async () => {
    const deletedUser = await deleteUser('timmy');

    const isInDatabase = await DatabaseConnection.getConnection().getRepository(User).exists({
        where: {
            id: 'timmy'
        }
    });

    expect(deletedUser).toBeInstanceOf(User);
    expect(isInDatabase).toBe(false);
});

afterEach(async () => {
    await DatabaseConnection.closeConnection();
});