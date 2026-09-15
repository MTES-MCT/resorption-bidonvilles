import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export default function validationMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        const fields = errorArray.reduce((acc, { param, msg }) => ({
            ...acc,
            [param]: [...(acc[param] ?? []), msg],
        }), {});

        // Construire un message plus informatif
        const firstError = errorArray[0]?.msg || 'Certaines données sont incorrectes';
        const errorCount = errorArray.length;
        const user_message = errorCount === 1
            ? firstError
            : `${errorCount} erreurs détectées. ${firstError}`;

        return res.status(400).send({
            user_message,
            fields,
        });
    }

    return next();
}
