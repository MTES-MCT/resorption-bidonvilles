import answerService from '#server/services/answer';
import { CreateAnswerServiceResponse } from '#server/services/answer/createAnswer';

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
        let message: string;
        switch (error && error.code) {
            case 'insert_failed':
                message = 'Votre réponse n\'a pas pu être enregistrée.';
                break;

            case 'fetch_failed':
                message = 'Votre réponse a bien été enregistrée mais la liste des réponse n\'a pas pu être actualisée.';
                break;

            default:
                message = 'Une erreur inconnue est survenue.';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(201).send(
        response,
    );
};
