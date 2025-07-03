import actionService from '#server/services/action/actionService';
import can from '#server/utils/permission/can';

const ERRORS = {
    write_fail: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    commit_failed: { code: 500, message: 'L\'enregistrement du commentaire et/ou des pièces jointes a échoué.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    general_error: { code: 500, message: 'Une erreur générale est survenue.' },
    infected_file_detected: { code: 500, message: 'Virus détecté ! Veuillez scanner vos fichiers avant de les téléverser' },
    unable_to_scan_file: { code: 500, message: 'L\'analyse d\'au moins un des fichiers a échouée' },
    unknown_request: { code: 500, message: 'Requête inconnue' },
};

export default async (req, res, next) => {
    if (!can(req.user).do('create', 'action_comment').on(req.body.action)) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour créer un commentaire sur cette action',
        });
    }

    try {
        const response = await actionService.createComment(req.user.id, req.body.action, {
            description: req.body.description,
            files: req.files,
        });
        return res.status(201).send(response);
    } catch (error) {
        const { code, nativeError } = error;

        res.status(typeof code === 'string' ? parseInt(code, 10) : code).send({
            user_message: ERRORS[nativeError].message ?? ERRORS.undefined.message,
        });
        return next(error.nativeError ?? error);
    }
};
