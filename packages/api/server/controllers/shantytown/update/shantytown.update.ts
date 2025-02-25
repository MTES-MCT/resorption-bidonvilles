import shantytownService from '#server/services/shantytown';
import can from '#server/utils/permission/can';
import { Shantytown } from '#root/types/resources/Shantytown.d';

const ERROR_RESPONSES = {
    insert_failed: { code: 500, message: 'Votre mise à jour de site n\'a pas pu être enregistrée.' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    commit_failed: { code: 500, message: 'L\'enregistrement des modifications et/ou des pièces jointes a échoué.' },
    fetch_failed: { code: 500, message: 'Votre mise à jour a bien été enregistrée mais une erreur s\'est produite. Veuillez rafraichir la page.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue.' },
};

export default async (req, res, next) => {
    // DESACTIVATION TEMPORAIRE DE LA VERIFICATION D'ACCES
    /*
    if (!can(req.user).do('update', 'shantytown').on(req.body)) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour mettre à jour les données du site.',
        });
    }
    */

    if (req.files?.length > 0 && !can(req.user).do('access', 'shantytown_justice').on(req.body)) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour ajouter des arrêtés en pièces jointes de ce site.',
        });
    }

    let updatedTown: Shantytown;
    try {
        updatedTown = await shantytownService.update(
            { ...req.body, id: req.params.id },
            req.user,
            {
                filesDatas: req.body.attachments,
                files: req.files,
            },
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError || error);
    }

    return res.status(200).send(
        updatedTown,
    );
};
