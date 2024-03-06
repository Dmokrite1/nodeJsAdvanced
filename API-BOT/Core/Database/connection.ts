import { DataSource } from "typeorm";


export class DatabaseConnection {
    private static databaseConnection?: DataSource;

    /**
     * Singleton pas fainéant (not lazy)
     */
    public static getConnection() {
        if (this.databaseConnection === undefined) {
            throw new Error("La connection à la base de données doit être initialisée");
        }
        return this.databaseConnection;
    }

    /**
     * Singleton fainéant (lazy)
     */
    public static async lazyGetConnection() {
        if (this.databaseConnection === undefined) {
            await this.init();
        }
        return this.databaseConnection;
    }

    /**
     * getter Alias
     */
    public static get manager() {
        return this.getConnection().manager;
    }

    /**
     * Initialize moi la connection DB
     */
    public static async init() {
        const connection = new DataSource({
            host: 'localhost',
            port: 3306,
            database: process.env.DB_DATABASE,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            type: 'mysql',
            logging: false,
            entities: ["Core/Models/*.ts"]
        });
        
        await connection.initialize();

        this.databaseConnection = connection;
    }

    public static async closeConnection() {
        await this.databaseConnection?.destroy();
    }
}