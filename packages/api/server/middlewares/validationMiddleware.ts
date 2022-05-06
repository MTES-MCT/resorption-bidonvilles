import * as expressValidator from 'express-validator';

const { validationResult } = expressValidator;

export default function validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({
            user_message: 'Certaines données sont incorrectes',
            fields: errors.array().reduce((acc, { param, msg }) => Object.assign({}, acc, {
                [param]: [...(acc[param] || []), msg],
            }), {}),
        });
    }

    return next();
}
