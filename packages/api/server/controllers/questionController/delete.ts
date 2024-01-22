import { NextFunction, Request, Response } from 'express';
import deleteQuestion from '#server/services/question/delete';
import Question from '#server/models/questionModel/Question.d';

interface QuestionDeleteRequest extends Request {
    question:Question
}

const ERROR_RESPONSES = {
    insert_failed: { code: 500, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req:QuestionDeleteRequest, res:Response, next:NextFunction): Promise<void> => {
    try {
        await deleteQuestion(req.question.id);
        res.status(204).send({});
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        next(error.nativeError || error);
    }
};
