import answerService from '#server/services/answer';
import { CreateAnswerServiceResponse } from '#server/services/answer/createAnswer';

const ERRORS = {
    insert_failed: { code: 500, message: 'Votre réponse n\'a pas pu être enregistrée.' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    fetch_failed: { code: 500, message: 'Votre réponse a bien été enregistrée mais la liste des réponse n\'a pas pu être actualisée.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    general_error: { code: 500, message: 'Une erreur générale est survenue.' },
    infected_file_detected: { code: 500, message: 'Virus détecté ! Veuillez scanner vos fichiers avant de les téléverser' },
    unable_to_scan_file: { code: 500, message: 'L\'analyse d\'au moins un des fichiers a échouée' },
    unknown_request: { code: 500, message: 'Requête inconnue' },
};

export default async (req, res, next) => {
    let response: CreateAnswerServiceResponse;

    try {
        response = await answerService.createAnswer(
            {
                description: req.body.description,
            },
            req.body.question,
            req.user,
            req.files,
        );
    } catch (error) {
        const { code, nativeError } = error;

        res.status(typeof code === 'string' ? parseInt(code, 10) : code).send({
            user_message: ERRORS[nativeError].message ?? ERRORS.undefined.message,
        });
        return next(error.nativeError ?? error);
    }

    return res.status(201).send(
        response,
    );
};
