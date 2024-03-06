import { rm } from "fs/promises";
import { Sound } from "../Models/sounds";
import { DatabaseConnection } from "./connection";
import { EntityNotFoundError } from "../../Api/Errors/entity-not-found.error";
import { Like } from "typeorm";

export async function getAllSounds (relations: string[] = []) {
    return DatabaseConnection.manager.find(Sound, {
        relations
    });
}

export async function createSound(obj: Object) {
    const sound = DatabaseConnection.manager.create(Sound, obj);
    await DatabaseConnection.manager.save(sound);
    return sound;
}

export async function getSoundById(id: string) {
    const sound = await DatabaseConnection.manager.findOne(Sound, {
        where: {
            id
        }
    });

    if (!sound) {
        throw new EntityNotFoundError();
    }

    return sound;
}

// get sound by any property
export async function getSoundBy(property: keyof Sound, value: string) {
    const sound = await DatabaseConnection.manager.findOne(Sound, {
        where: {
            [property]: value
        }
    });

    return sound;
} 

export async function searchSound(value: string) {
    const sounds = await DatabaseConnection.manager.find(Sound,{
        where: {
            name: Like(`${value}%`)
        },
        // 25 max, discord en affichera pas plus
        take: 25
    });

    return sounds;
}

export async function deleteSound (id: string) {
    const sound = await getSoundById(id);
    await DatabaseConnection.manager.delete(Sound, sound);
    await deleteFile(sound.file);
}

// suppression du FICHIER son
export async function deleteFile(file: string) {
    const path = `uploads/${file}`;
    await rm(path);
}

export async function replaceSound(id: string, body: Object) {
    const sound = await getSoundById(id);
    const originalFile = sound.file;
    Object.assign(sound, body);

    await DatabaseConnection.manager.save(sound);

    await deleteFile(originalFile);
}



