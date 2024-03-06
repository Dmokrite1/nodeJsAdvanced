import { NextFunction, Request, Response, Router } from "express";
import { body } from 'express-validator';
import multer from "multer";
import { getAllCategories } from "../../Core/Database/categories";
import { createSound, deleteSound, getAllSounds, getSoundById, replaceSound } from "../../Core/Database/sounds";
import { createAuthorizeMiddleWare } from "../Middlewares/authorize.middleware";
import { FileValidationMiddleware } from "../Middlewares/file-validation.middleware";
import { Role } from "../../Core/Models/users";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        // ['lapin', 'mp3']
        const fileParts = file.originalname.split('.');
        const extension = fileParts.pop();
        // file.mp3
        // => file-4556466.mp3
        cb(null, `${fileParts.join('.')}-${Date.now()}.${extension}`);
    }
});

const configuredMulter = multer({
    dest: './uploads',
    storage,
})

export const soundRouter = Router();

soundRouter.get('/', createAuthorizeMiddleWare([]), async (request, response) => {
    const sounds = await getAllSounds();
    response.send(sounds);
});

soundRouter.get('/list', async (request, response) => {
    const [sounds, categories] = await Promise.all([
        getAllSounds(['category']),
        getAllCategories()
    ]);

    response.render('sound_list', {
        categories,
        sounds,
    });
})

soundRouter.get('/:id', createAuthorizeMiddleWare([]), async (request: Request, response: Response, next: NextFunction) => {
    const sound = await getSoundById(request.params.id);
    response.send(sound);
});

const uploadValidation = [
    body('name').notEmpty(),
    body('category').notEmpty(),
    // on vérifie que c'est un audio/mpeg => mp3
    body('files.*.mimetype').isIn(['audio/mpeg'])
];

// array => multiple
soundRouter.post('/', configuredMulter.array('sound'), (req, _res, next) => {
    // petit hack qui permet de valider avec express-validator. On met le file dans le body
    req.body.files = req.files; // => tableau de fichiers 
    // on passe à la suite => ...uploadValidation
    next();
} , ...uploadValidation, FileValidationMiddleware, async (request, response) => {
    // soit un objet de files, soit un tableau de files. On doit utiliser une assertion pour lui indiquer le bon type.
    const files = request.files as Express.Multer.File[];

    for (const file of files) {
        // truc.mp3
        const fileName = file.filename.split('.');
        // => ['truc', 'mp3']
        fileName.pop();
        // => ['truc']

        let name = `${request.body.name}-${fileName.join('.')}`;

        if (files.length === 1) {
            name = request.body.name; 
        }

        await createSound({
            id: new Date().getTime().toString(),
            name,
            category: request.body.category,
            // filename à la place de originalName pour avoir le nom du fichier final qui sera stocké sur le disque
            file: file.filename,
        });
    }

    response.redirect('/sounds/list');
})

// Les formulaires en html n'accepte que les method post et get. Pour pas écrire un fetch,
// Nous avons fait un post /:id qui se comporte comme un put.
soundRouter.post('/:id', configuredMulter.single('sound'), async (request, response) => {
    await replaceSound(request.params.id, {
        ...request.body,
        file: request.file?.filename,
    });
    response.redirect('/sounds/list');
});

soundRouter.delete('/:id', createAuthorizeMiddleWare([Role.ADMIN, Role.USER]), async (request, response) => {
    await deleteSound(request.params.id);
    response.status(204).send(null);
})
