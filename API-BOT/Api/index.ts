import cookieParser from "cookie-parser";
import express, { Application, json } from "express";
import rateLimit from "express-rate-limit";
import mustacheExpress from "mustache-express";
import { internalServerErrorHandler } from "./Error-handler/internal-server-error.handler";
import { notFoundErrorHandler } from "./Error-handler/not-found-error.handler";
import { NotFoundError } from "./Errors/not-found.Error";
import { loggerMiddleware } from "./Middlewares/logger.middleware";
import { authRouter } from "./routers/auth.router";
import { soundRouter } from "./routers/sounds.router";
import { userRouter } from "./routers/users.router";

const PORT = 8081;

export function initApi() {
    const application: Application = express();
    
    application.engine('mustache', mustacheExpress());
    application.set('view engine', 'mustache');
    application.set('views', './Api/Views');
    
    application.use(rateLimit({
        limit: 20,
        windowMs: 10 * 1000
    }))
    application.use(cookieParser());
    application.use(json());
    application.use(loggerMiddleware);
    application.use('/assets', express.static(__dirname + '/assets'));
    application.use('/static', express.static(process.cwd() + '/uploads'));
    application.use('/sounds', soundRouter);
    application.use('/users', userRouter);
    application.use('/auth', authRouter);
    
    //override le comportement par défaut pour la 404
    application.use((request, response, next) => {
        throw new NotFoundError();
    })
    application.use(notFoundErrorHandler);
    application.use(internalServerErrorHandler);
    
    
    application.listen(PORT, () => {
        console.log(`Prêt et à l\'écoute sur http://localhost:${PORT}`);
    })
}