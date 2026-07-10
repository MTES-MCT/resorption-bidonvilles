import directoryViewService from '#server/services/directoryView/directoryViewService';
import { ControllerErrors } from '#server/errors/ControllerErrors';

const ERRORS: ControllerErrors = {
    organization_not_found: { code: 400, message: 'La structure consultée n\'a pas été trouvée en base de données' },
    fetch_failed: { code: 500, message: 'Une erreur est survenue lors de la lecture en base de données' },
    write_failed: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

const create = async (req, res, next) => {
    const organizationId = Number.parseInt(req.body.organization, 10);

    try {
        await directoryViewService.create(organizationId, req.user);
        return res.status(201).send({});
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError ?? error);
    }
};

export default create;
