import questionService from '#server/services/question';

export default async (req, res, next) => {
    let question;

    try {
        question = await questionService.createQuestion(
            req.body,
            req.user,
        );
    } catch (error) {
        let message;
        switch (error && error.code) {
            case 'insert_failed':
                message = 'Votre question n\'a pas pu être enregistrée.';
                break;

            case 'fetch_failed':
                message = 'Votre question a bien été enregistrée mais la liste des questions n\'a pas pu être actualisée.';
                break;

            default:
                message = 'Une erreur inconnue est survenue.';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(201).send({
        question,
    });
};
