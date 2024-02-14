import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    const errors = result.array();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (errors.length > 0) {
        res.status(400);
        return res.send({
            errors
        });
    }
    next();
};
