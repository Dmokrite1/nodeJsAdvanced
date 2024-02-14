import { Router, response } from "express";

export const userRouter = Router();

userRouter.get('/', (request, response) => {
    response.send({
        users: [
            {
                firstname: 'Thomas A',
                lastname: 'Anderson'
            }
        ]
    })
})

userRouter.get('/oracle', (request, response) => {
    response.send("You are the chosen one Néo");
})

userRouter.post('/', (request, response) => {
    console.log(request.body);
    response.send(request.body);
})

userRouter.get('/:id', (request, response) => {
    console.log(request.params);
    response.send(request.params);
})