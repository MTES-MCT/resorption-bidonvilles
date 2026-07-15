import organizationService from '#server/services/organization/organizationService';
import { ControllerErrors } from '#server/errors/ControllerErrors';

const ERRORS: ControllerErrors = {
    fetch_failed: { code: 500, message: 'Une erreur est survenue lors de la lecture en base de données' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

const list = async (req, res, next) => {
    try {
        const organizations = await organizationService.getDirectory(req.user);
        return res.status(200).send({
            organizations,
        });
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError ?? error);
    }
};

export default list;
