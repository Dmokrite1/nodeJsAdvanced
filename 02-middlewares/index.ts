import express, { Router } from 'express';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { authorizeMiddleWare } from './middlewares/authorize.middleware';

const application = express();

const routerBidon = Router();

// le middleWare s'éxécutera après tous les middlewares liès à l'application
routerBidon.use(authorizeMiddleWare);

routerBidon.get('/', (request, response) => {
    response.send('Je ne suis pas une vrai route');
})

routerBidon.get("/duplicate", (request, response) => {
    response.send("Je suis une copie de la 'pas une vrai route'");
});

application.use(loggerMiddleware);

application.use('/bidon', routerBidon);

application.get('/banane', (request, response) => {
    response.send('Many banana');
})

application.get('/protectBanana', authorizeMiddleWare, (request, response) => {
    response.send('banana');
})

application.listen(8001, () => {
   console.log('Hello World !');
})