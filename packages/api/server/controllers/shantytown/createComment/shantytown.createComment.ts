import shantytownCommentService from '#server/services/shantytownComment';
import can from '#server/utils/permission/can';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

const ERROR_RESPONSES = {
    insert_failed: { code: 500, message: 'Votre commentaire n\'a pas pu être enregistré.' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    commit_failed: { code: 500, message: 'L\'enregistrement du commentaire et/ou des pièces jointes a échoué.' },
    fetch_failed: { code: 500, message: 'Votre commentaire a bien été enregistré mais la liste des commentaires n\'a pas pu être actualisée.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue.' },
};
// TODO: typer req, res et next
export default async (req, res, next) => {
    if (!can(req.user).do('create', 'shantytown_comment').on(req.body.shantytown)) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour ajouter un message dans le journal de ce site.',
        });
    }

    let comments: { comments: ShantytownEnrichedComment[], numberOfWatchers: number };
    try {
        comments = await shantytownCommentService.createComment(
            {
                description: req.body.comment,
                targets: req.body.targets,
                tags: req.tags,
                files: req.files,
            },
            req.body.shantytown,
            req.user,
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError || error);
    }

    return res.status(200).send({
        comments,
    });
};
