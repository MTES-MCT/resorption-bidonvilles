import shantytownCommentService from '#server/services/shantytownComment';
import can from '#server/utils/permission/can';
import { type Response, type Request, NextFunction } from 'express';
import { User } from '#root/types/resources/User.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

const ERROR_RESPONSES = {
    insert_failed: { code: 500, message: 'Votre commentaire n\'a pas pu être enregistré.' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    commit_failed: { code: 500, message: 'L\'enregistrement du commentaire et/ou des pièces jointes a échoué.' },
    fetch_failed: { code: 500, message: 'Votre commentaire a bien été enregistré mais la liste des commentaires n\'a pas pu être actualisée.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue.' },
    general_error: { code: 500, message: 'Une erreur inconnue est survenue.' },
    infected_file_detected: { code: 500, message: 'Virus détecté ! Veuillez scanner vos fichiers avant de les téléverser.' },
    unable_to_scan_file: { code: 500, message: 'L\'analyse d\'au moins un des fichiers a échouée' },
    unknown_request: { code: 500, message: 'Requête inconnue' },
};

interface UserCreateCommentRequest extends Request {
    user: User;
    body: {
        shantytown: Shantytown;
        comment: string;
        targets: string[];
    };
    tags: string[];
    files: Express.Multer.File[];
}

export default async (req: UserCreateCommentRequest, res: Response, next: NextFunction) => {
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
        const nativeErrorMessage = error?.nativeError && typeof error.nativeError.message === 'string'
            ? error.nativeError.message
            : undefined;
        const nativeErrorKey = nativeErrorMessage && ERROR_RESPONSES[nativeErrorMessage]
            ? nativeErrorMessage
            : undefined;
        const userMessage = nativeErrorKey
            ? ERROR_RESPONSES[nativeErrorKey].message
            : ERROR_RESPONSES.undefined.message;
        const code = ERROR_RESPONSES[nativeErrorKey].code
        res.status(code || 10).send({
             user_message: userMessage,
        });
        return next(error.nativeError || error);
    }

    return res.status(200).send({
        comments,
    });
};
