import { DatabaseConnection } from "./Core/Database/connection";
import { config } from "dotenv";
import { seeder } from "./Core/Database/seeder";
import { initApi } from "./Api";
import { initBot } from "./Bot";

// classes => PascalCase
// function => camelCase
// variable => camelCase
// constantes => SCREAMING_SNAKE_CASE
// fichiers => kebab | camelCase | Pascal | ...

async function initApplication() {
    config({
        path: 'development.env'
    });

    await DatabaseConnection.init();
    const databaseInstance = DatabaseConnection.getConnection();


    if (process.env.DB_REFRESH === "true") {
        console.log("Refreshing de la DB ...");

        await databaseInstance.dropDatabase();
        await databaseInstance.synchronize();
        await seeder();
    }else{
        await databaseInstance.synchronize();
    }

    await initBot();
    initApi();
}


initApplication();