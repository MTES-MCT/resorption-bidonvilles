import { validationResult } from 'express-validator';

export default (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({
            user_message: 'Certaines données sont incorrectes',
            fields: errors.array().reduce((acc, { param, msg }) => ({
                ...acc,
                [param]: [...(acc[param] ?? []), msg],
            }), {}),
        });
    }

    return next();
};
