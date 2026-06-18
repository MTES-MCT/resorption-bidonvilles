import shantytownService from '#server/services/shantytown';

const ERROR_RESPONSES = {
    not_found: { code: 404, message: 'Le site que vous essayez de mettre à jour n\'existe pas.' },
    permission_denied: { code: 403, message: 'Vous n\'avez pas les permissions nécessaires pour mettre à jour ce site.' },
    update_failed: { code: 500, message: 'La mise à jour de site n\'a pas pu être enregistrée.' },
    fetch_failed: { code: 500, message: 'Votre mise à jour a bien été enregistrée mais une erreur s\'est produite. Veuillez rafraichir la page.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue.' },
};

export default async function forceUpdateWithoutChanges(req, res, next) {
    let updatedTown = null;
    try {
        updatedTown = await shantytownService.forceUpdateWithoutChanges(
            req.params.id,
            req.user,
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }

    return res.status(200).send(
        updatedTown,
    );
}
