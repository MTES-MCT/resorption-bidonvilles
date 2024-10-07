import shantytownDecreeService from '#server/services/shantytownDecree';
import can from '#server/utils/permission/can';

const ERROR_RESPONSES = {
    insert_failed: { code: 500, message: 'L\'arrêté n\'a pas pu être enregistré.' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    commit_failed: { code: 500, message: 'L\'enregistrement de l\'arrêté et/ou des pièces jointes a échoué.' },
    fetch_failed: { code: 500, message: 'Votre arrêté a bien été enregistré mais la liste des pièces jointes n\'a pas pu être actualisée.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue.' },
};

export default async (req, res, next) => {
    console.log("VERIFICATION DU DROIT D'ACCES");
    console.log('User:', req.user);

    console.log(can(req.user).do('access', 'shantytown_justice').on(req.body.shantytown));
    console.log('VERIFICATION TERMINEE');


    if (!can(req.user).do('access', 'shantytown_justice').on(req.body.shantytown)) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour ajouter un arrêté sur ce site.',
        });
    }

    // let comments: { comments: ShantytownEnrichedComment[], numberOfWatchers: number };
    // try {
    //     comments = await shantytownCommentService.createComment(
    //         {
    //             description: req.body.comment,
    //             targets: req.body.targets,
    //             tags: req.tags,
    //             files: req.files,
    //         },
    //         req.body.shantytown,
    //         req.user,
    //     );
    // } catch (error) {
    //     const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
    //     res.status(code).send({
    //         user_message: message,
    //     });
    //     return next(error.nativeError || error);
    // }
    let decrees = [];
    try {
        decrees = await shantytownDecreeService.create({
            description: req.body.description,
            targets: req.body.targets,
            fk_shantytown: req.body.shantytown.id,
            created_by: req.user.id,
        });
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError || error);
    }

    return res.status(200).send({
        decrees,
    });
};
