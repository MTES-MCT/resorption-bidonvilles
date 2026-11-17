import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CONFIG from '#server/config';
import { ControllerErrors } from '#server/errors/ControllerErrors';
import userService from '#server/services/user';

const ERRORS: ControllerErrors = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

/**
 * Vérifie la validité du jeton, puis met à jour le mot de passe
 * @param req - Requête
 * @param res - Réponse
 * @param next - Prochain middleware
 */
const setPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    if (!req.body.token) {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification est manquant',
        });
    }

    let decoded: any;
    try {
        decoded = jwt.verify(req.body.token, CONFIG.auth.secret);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(400).send({
            user_message: 'Le jeton d\'identification est invalide ou expiré',
        });
    }

    if (decoded.type !== 'password_reset') {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification n\'est pas valide',
        });
    }

    try {
        await userService.setPassword(req.body.password, decoded.userId, decoded);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError ?? error);
    }

    return res.status(200).send({});
};
export default setPassword;
