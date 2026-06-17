import { validationResult } from 'express-validator';

export default (req, res, next) => {
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
};
