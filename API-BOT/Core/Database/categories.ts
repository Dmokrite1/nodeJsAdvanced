import { Category } from "../Models/categories";
import { DatabaseConnection } from "./connection";

export async function getAllCategories() {
    return DatabaseConnection.manager.find(Category);
}