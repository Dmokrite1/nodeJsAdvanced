import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { deleteFile } from "../../Core/Database/sounds";

export const FileValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    const errors = result.array();

    if (errors.length > 0) {
        if (req.body.files) {
            for (const file of req.body.files) {
                await deleteFile(file.filename);
            }
        }
        // bad request
        res.status(400);
        return res.send({
            errors
        });
    }

    // on passe à suite
    next();
}
