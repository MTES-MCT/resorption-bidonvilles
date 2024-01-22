import { NextFunction, Request, Response } from 'express';
import deleteQuestion from '#server/services/question/delete';
import { Question } from '#root/types/resources/Question.d';

interface QuestionDeleteRequest extends Request {
    question: Question
}

const ERROR_RESPONSES = {
    delete_failed: { code: 500, message: 'La suppression des données en base a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req:QuestionDeleteRequest, res:Response, next:NextFunction): Promise<void> => {
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
