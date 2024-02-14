import { NextFunction, Request, Response } from "express";

// Un middleware est défini comme une fonction qui accepte 3 arguments: Request, Response et next(la function suivante à éxecuter) 
export async function loggerMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
    console.log(`Une requête ${request.method} sur la route ${request.url} le ${new Date().toDateString()}`);
    next();
}