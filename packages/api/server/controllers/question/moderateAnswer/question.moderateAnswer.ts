import { NextFunction, Request, Response } from 'express';
import deleteAnswer from '#server/services/answer/deleteAnswer';
import { Answer } from '#root/types/resources/Answer.d';
import { Question } from '#root/types/resources/Question.d';

interface DeleteAnswerRequest extends Request {
    answer: Answer,
    question: Question,
    body: {
        reason?: string,
    },
}

const ERRORS = {
    delete_failed: { code: 500, message: 'Une erreur est survenue lors de la suppression de la réponse' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req: DeleteAnswerRequest, res: Response, next: NextFunction) => {
    try {
        await deleteAnswer(req.question, req.answer, req.body.reason);
        res.status(201).send({});
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error?.nativeError || error);
    }
};
