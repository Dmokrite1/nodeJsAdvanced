import { compare } from "bcrypt";
import { Router } from "express";
import { sign } from "jsonwebtoken";
import { DatabaseConnection } from "../../Core/Database/connection";
import { User } from "../../Core/Models/users";
import { EntityNotFoundError } from "../Errors/entity-not-found.error";
import rateLimit from "express-rate-limit";

const authRouter = Router();

// récupération de la page
authRouter.get('/login', async (request, response) => {
    return response.render('login_page', {});
});

// authentication
authRouter.post('/login', 
    rateLimit({
        limit: 1,
        windowMs: 1 * 1000
    }),
async (request, response, next) => {
    const { username , password } = request.body;

    const user = await DatabaseConnection.manager.findOne(User, {
        where: {
            username
        }
    });

    if (!user) {
        return next(new EntityNotFoundError("Mot de passe ou nom d'utilisateur incorrect"));
    }

    if (!await compare(password, user.password)) {
        return next(new EntityNotFoundError("Mot de passe ou nom d'utilisateur incorrect"));
    }

    const accessToken = sign({
        id: user.id,
        //issuedAt: à quel moment il a été généré
        iat: Math.floor(new Date().getTime() / 1000),
        // à quelle moment le token expire
        exp: Math.floor((new Date().getTime() / 1000) + 300),
    }, process.env.JWT_SECRET!);

    response.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 300000),
        httpOnly: true
    });

    response.send({
        accessToken
    });
});

export {
    authRouter
}
