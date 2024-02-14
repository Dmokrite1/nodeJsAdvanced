import { Router } from "express";
import { validationMiddleware } from "./validation-middleware";
import { checkSchema, param, query } from 'express-validator';

const router = Router();

/*
const validation = [
    body('title', "Le titre est obligatoire").notEmpty(),
    body('directors', "les rélisateurs doivent être un tableau").isArray(),
    body('is_released', 'is_released doit être un boolean').isBoolean().toBoolean()
];
*/

const schema = checkSchema({
    title: {
        notEmpty: true,
        errorMessage: "Le titre est obligatoire"
    },
    directors: {
        isArray: true,
        errorMessage: "les rélisateurs doivent être un tableau"
    },
    is_released: {
        isBoolean: true,
        toBoolean: true,
        errorMessage: 'is_released doit être un boolean'
    }
});

// Validation middleware 1 next(), validationResult middleware 2, (req,res) middleware 3, les 3 points ...validation quand on récupère un tableau d'arguments pour le spread et le mettre à plat et il doit toujours être le dernier (voir spread.ts)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.post('/movie', ...schema, validationMiddleware, (req, res) => {
    const body = req.body;

    console.log(body);

    res.send("movie created");
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.get('/movie/:id', param('id').isUUID(), (req, res) => {
    const param = req.params?.id;
    console.log(param);
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.get('/movie', query('page').isInt().optional().toInt(), validationMiddleware, (req, res) => {
    const query = req.query;
    console.log(query);
    res.send({
        title: 'Jurassic Park'
    });
});

export { router };
