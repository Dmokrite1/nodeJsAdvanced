import { Application, Request } from "express";
import express from "express";
import { userRouter } from "./routers/user.router";

//crée le serveur
const application: Application = express();

application.use(express.json());

application.use("/users", userRouter);

//définir une route -> comme createhttpserver
application.get('/matrix', (request: Request, response) => {
    response.send('Enter the matrix')
})

//démarre le serveur
application.listen(8001, () => {
    console.log("I'm ready on the port: 8001");
})