import questionService from '#server/services/question';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';

const ERRORS = {
    insert_failed: { code: 500, message: 'Votre question n\'a pas pu être enregistrée.' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    fetch_failed: { code: 500, message: 'Votre question a bien été enregistrée mais la liste des questions n\'a pas pu être actualisée.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    general_error: { code: 500, message: 'Une erreur générale est survenue.' },
    infected_file_detected: { code: 500, message: 'Virus détecté ! Veuillez scanner vos fichiers avant de les téléverser' },
    unable_to_scan_file: { code: 500, message: 'L\'analyse d\'au moins un des fichiers a échouée' },
    unknown_request: { code: 500, message: 'Requête inconnue' },
};

export default async (req, res, next) => {
    let question: EnrichedQuestion;

    try {
        question = await questionService.createQuestion(
            req.body,
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
        question,
    );
};
