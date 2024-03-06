import { EntityNotFoundError } from "../../Api/Errors/entity-not-found.error";
import { DatabaseConnection } from "./connection";
import { User } from "../Models/users";

export async function getAllUsers() {
    return DatabaseConnection.manager.find(User);
}

export async function getUserById(id: string) {
    const foundEntity = await DatabaseConnection.manager.findOne(User, {
        where: {
            id
        }
    });

    if (!foundEntity) {
        throw new EntityNotFoundError();
    }

    return foundEntity;
}

export async function insertUser(body: Object) {
    const user = DatabaseConnection.manager.create(User, body);
    await DatabaseConnection.manager.save(user);    
    return user;
}

export async function updateUser (id: string, body: Object) {
    const user = await getUserById(id);
    Object.assign(user, body);
    await DatabaseConnection.manager.save(user);
    return user;
}

export async function deleteUser (id: string) {
    const user = await getUserById(id);
    await DatabaseConnection.manager.delete(User, user);
    return user;
}