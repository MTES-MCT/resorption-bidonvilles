import { NextFunction, Request, Response } from 'express';
import deleteQuestion from '#server/services/question/delete';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';
import { User } from '#root/types/resources/User.d';

interface QuestionDeleteRequest extends Request {
    user: User,
    question: EnrichedQuestion
}

const ERROR_RESPONSES = {
    delete_failed: { code: 500, message: 'La suppression des données en base a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req:QuestionDeleteRequest, res:Response, next:NextFunction): Promise<void> => {
    if (req.user.is_superuser !== true) {
        res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour supprimer une question',
        });
        return;
    }

    try {
        await deleteQuestion(req.question.id);
        res.status(204).send({});
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};
