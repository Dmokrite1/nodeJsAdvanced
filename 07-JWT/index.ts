// Importation des modules nécessaires depuis Express et jsonwebtoken
import express, { NextFunction, Request, Response, response } from "express";
import JWT from 'jsonwebtoken';
import { DataSource } from "typeorm";
import { User } from "./user";
import { compare, hash } from "bcrypt";
import { request } from "http";
import cors from "cors";

// Clé secrète pour JWT, typiquement elle devrait être stockée de manière plus sécurisée
export const jwt_secret = `MIICXQIBAAKBgQC5CE2UBc/+Ewh56sAbSNX9e3+bcGSIWalB1lHFkYls3WtXE3ZB
wd4NbN6J2Fw2qwxo/YDVgASGyY2LPkcJKD1ZP3gsG+LjTgixLC7X+pEFbeF0qh3t
Bes0lTFcsTqVyuiENUmM6YyF7RSBFFLPiSuUJylOC6yhd+/f0YXSWKrtHQIDAQAB
AoGABS8CXV88UHXgCupUr27+77cCACzJ5Df+0eVbLRnCq9YYJ7xX18fCnMWsBliV
XMK1+kr/zPtlJRGIcZoxC0ShU06OEaDxm7ixC1UkxlmquaWcBmo31tRlXlaMqnzb
NC/MIK+QRVle4JONkeV/PGJw8gt/tzFRbzIudonnqFoXalECQQDaImYyDxawYBT+
hZsSjtZwQvtSeIcYUMpw/KjyKSrEHAvaYbzEVYq70nSeL8Tkx8ndKm35/gVsFx9a
vUT89uajAkEA2Sbl14dMBCzKKky5f4/xl+DXSWNwfgdZa7wWQMjEZz4uODFOhavV
fEC7KZHEsQhBBkOotZGJIwpKLExrpnjZPwJBALpcf0EvYOwI+obFMMp3HD/HCh7Y
eFrO01YalmBlyXLIn1vQ+swmZSO4Vwe6uhXXluAMWu8lFg7V5mTIpUMV0c8CQQDZ
BB6/ft9hbMG99F+ONHTlrDZ7iX1q9j1PhfFXXU2rQGFAl0Y6ILiCLM7fhGZl5jHV
6Ng6XPAIrMfj7ZvICw5RAkAUCkhrs3NF7rZB4EoFkaJdipSCNysPhzURJMFMv6Yb
A1HcaoKtL/QcZd68Tt7DIiY+KgpVDxzxSRw0O5izT0K5`;

// Données d'utilisateur de démonstration
/*
const users = [{
  email: "test@test.com",
  id: 1,
},{
  email: "test@banane.com",
  id: 2,
},{
  email: "test@orange.com",
  id: 3,
}];
*/

// Middleware qui vérifie si l'utilisateur est connecté avant de permettre l'accès à la route '/'
const isLoggedMiddleWare = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
        return response.send("Accès interdit");
    }
    const payload = JWT.verify(token, jwt_secret);
    console.log(payload);
    
    next();
};

async function init() {

// Initialisation de l'application Express
const app = express();

// Utilisation du middleware express.json() pour parser les requêtes JSON
app.use(express.json());
app.use(cors());

//faire une petite db qu'on peux stocker en mémoire
const database = new DataSource({
    type: 'sqlite',
    database: 'jwt-example',
    entities: [User]
})

await database.initialize();
await database.synchronize();

const dramix = database.manager.create(User, {
    name: 'Dramix',
    password: await hash('banana', 10)
});

await database.manager.save(dramix);

// Route qui génère le jeton JWT lorsqu'un utilisateur se connecte
app.post('/login', async (request: Request, response: Response) => {
    const  {name, password} = request.body as User;
   
    const user = await database.manager.findOne(User, {
        where: {
            name
        }
    });

    if (user === null) {
        return response.send("password or username does not match");
    }
    const isMatching = await compare(password, user.password);

    if (!isMatching) {
        return response.send("password or username does not match")
    }

    
    const token = JWT.sign({
        id: user?.id,
        // iat = le moment auquel le JWT a été généré
        iat: new Date().getTime() / 1000,
        exp: (new Date().getTime() / 1000) + 300,
    }, jwt_secret);

    
    response.send({
        token
    });
    
});

// Route protégée qui nécessite une connexion pour accéder
app.get('/', isLoggedMiddleWare, (request, response) => {
    response.send('ok');
});

// Écoute du serveur sur le port 8001
app.listen(8001, () => {
    console.log('Tu es log');
});
}

init();