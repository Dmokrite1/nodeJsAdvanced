import { NextFunction, Request, Response } from "express";

export async function authorizeMiddleWare(
    request: Request,
    response: Response,
    next: NextFunction
) {
    console.log('authorize');
    const user = request.query.user;

    if (!user || user !== "Dramix") {
        // Ne pas oublier le return sinon, il continue tout de même la chaine
        return response.status(403).send("Forbidden");
    }

    next();
}