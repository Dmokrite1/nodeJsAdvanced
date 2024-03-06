import { DatabaseConnection } from "../Core/Database/connection";
import { Role, User } from "../Core/Models/users";

export async function seedForTesting() {
    const connection = DatabaseConnection.getConnection();
    // TRUNCATE TABLE 
    await connection.dropDatabase();
    await connection.synchronize();
    
    const userForTest = connection.getRepository(User).create({
        id: 'timmy',
        username: 'Dramix',
        lastName: 'Banane',
        firstName: 'Loutre',
        role: Role.ADMIN,
        password: 'sjflkdjsflkdj'
    });

    await connection.getRepository(User).save(userForTest);
 }
