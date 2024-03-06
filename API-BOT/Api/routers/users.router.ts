import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, insertUser, updateUser } from "../../Core/Database/users";
import { createAuthorizeMiddleWare } from "../Middlewares/authorize.middleware";
import { Role } from "../../Core/Models/users";

export const userRouter = Router();

userRouter.use(createAuthorizeMiddleWare([Role.ADMIN]));

userRouter.get('/', async (request, response) => {
    const allUsers = await getAllUsers();
    response.send(allUsers);
})

userRouter.get('/list', async (request, response) => {
   const users = await getAllUsers();  
   response.render("user_list", {
        users,
        isCurrentRole: () => function (placeholder: string, render: Function) {
            const [currentRole, testedRole] = render(placeholder).trim().split(" ");
            if (currentRole === testedRole) {
                return "disabled";
            }
            return "";
        }
   })
});

userRouter.get('/:id', async (request, response, next) => {
    try {
        const user = await getUserById(request.params.id);
        response.send(user);
    } catch(err) {
        next(err);
    }
})

userRouter.post('/', async (request, response) => {
    response.send(await insertUser(request.body));
})

userRouter.patch('/:id', async (request, response, next) => {
    try {
        const user = await updateUser(request.params.id, request.body);
        response.send(user);
    } catch(err) {
        next(err);
    }
})

userRouter.delete('/:id', async (request, response) => {
    await deleteUser(request.params.id);
    response.status(204).send(null);
})