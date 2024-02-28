// Importation des classes et méthodes nécessaires de TypeORM
import { DataSource, Equal, IsNull, LessThan, MoreThan, Not, Raw } from "typeorm";
import { Game, GameType } from "./models/games";
import { Platform } from "./models/platform";
import { seedDatabase } from "./seeder";

// Fonction asynchrone d'initialisation
async function init() {
    // Création d'une connexion à la base de données avec les paramètres spécifiés
    const connection = new DataSource({
        type: 'mysql',
        port: 3336,
        host: 'localhost',
        database: 'bot-theorie',
        password: 'bot-theorie',
        username: 'bot-theorie',
        // entities: [Game]
        entities: ['src/models/*.ts'], // Spécification des entités (tables) à prendre en compte
        logging: ['query'] // Activation de l'enregistrement des requêtes dans la console
    });

    // Récupération du gestionnaire de la connexion
    const manager = connection.manager;

    // Initialisation de la connexion à la base de données
    await connection.initialize();
    await connection.dropDatabase();
    // Synchronisation des entités avec la base de données
    await connection.synchronize();

    await seedDatabase(manager);

    // Récupération de tous les jeux dans la base de données avec genre contenant FANTASY
    const games = await manager.find(Game, {
        where: {
            genre: Raw((columnAlias) => {
                return `FIND_IN_SET(:value, ${columnAlias})`; // Utilisation de FIND_IN_SET pour chercher la valeur dans le tableau
            }, {
                value: GameType.FANTASY // La valeur à rechercher dans le tableau
            })
        }
    });

    console.log(games);

    // Récupération des jeux avec une note inférieure à 50
    const badGames = await manager.find(Game, {
        where: {
            note: LessThan(50) // Utilisation de l'opérateur LessThan pour filtrer les jeux avec une note inférieure à 50
        }
    });

    console.log(badGames);

    // Récupération des jeux sans prix
    const noPriceGames = await manager.find(Game, {
        where: {
            price: IsNull() // Utilisation de l'opérateur IsNull pour filtrer les jeux sans prix
        }
    });

    console.log('Jeux sans prix', noPriceGames);

    // Récupération des jeux dont le titre n'est pas 'Counter Strike'
    const notCounter = await manager.find(Game, {
        where: {
            title: Not('Counter Strike') // Utilisation de l'opérateur Not pour exclure les jeux avec le titre 'Counter Strike'
        }
    });

    console.log(notCounter);

    // Récupération du jeu avec le titre 'World of Warcraft'
    const wow = await manager.findOne(Game, {
        where: {
            title: Equal('World of Warcraft') // Utilisation de l'opérateur Equal pour filtrer le jeu avec un titre spécifique
        }
    });

    console.log(wow);

    // Récupération des jeux avec une date de sortie après le 1er janvier 2016 et affichage du premier résultat
    const ouinOuinGames = await manager.findAndCount(Game, {
        where: {
            releaseDate: MoreThan(new Date('2016-01-01')) // Utilisation de l'opérateur MoreThan pour filtrer les jeux avec une date de sortie après le 1er janvier 2016
        },
        take: 1 // Nombre maximum de résultats à retourner (dans ce cas, 1)
        // skip: 1, skip  le premier est affiche le deuxième
    });

    console.log(ouinOuinGames);
/*
    // Modification de la note du jeu 'Fortnite' à 43.0 et sauvegarde dans la base de données
    const fortnite = await manager.findOneOrFail(Game, {
        where: {
            title: Equal('Fortnite') // Récupération du jeu 'Fortnite'
        }
    });

    fortnite.note = 43.0;

    await manager.save(fortnite);
*/
    const fortnite = await manager.findOneOrFail(Game, {
        where: {
            title: Equal('Fortnite') // Récupération du jeu 'Fortnite'
        },
        relations: ['editor', 'platforms']
    });

    const XBOX = await manager.findOneOrFail(Platform, {
        where: {
            name: 'XBOX'
        }
    });

    fortnite.platforms.push(XBOX);

    await manager.save(fortnite);

    // Affichage dans la console du message "Connected" et des jeux récupérés
    console.log("Connected");
}

// Appel de la fonction init() (démarrage du processus d'initialisation)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
