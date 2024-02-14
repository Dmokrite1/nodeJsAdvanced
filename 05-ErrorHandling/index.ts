import express, { NextFunction, Request, Response } from "express";

const app = express();

// Une error handler est un middleware qui prend 4 arguments plutôt que 3
// Error, Request, Response et Next
class ErrorHandler {
    static notFoundError(error: Error, request: Request, response: Response, next: NextFunction) {
        if (error instanceof AppError) {
            response.redirect('https://perdu.com');
        }
    }
}

class AppError extends Error {};

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    ErrorHandler.notFoundError(error, request, response, next);
});

app.get('/', (req: Request, res: Response) => {
    throw new AppError('Powered by Franck !!');
});

app.listen(8001, () => {
    console.log("I'm ok, i'm ok, i'm ok, i'm not alcoholic");
});
