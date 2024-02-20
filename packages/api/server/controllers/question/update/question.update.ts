import questionService from '#server/services/question';
import { Request } from 'express';
import { User } from '#root/types/resources/User.d';
import { Question } from '#root/types/resources/Question.d';

interface QuestionUpdateRequest extends Request {
    user: User;
    question: Question;
}

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req: QuestionUpdateRequest, res, next) => {
    if (req.user.role_id !== 'national_admin' && req.question.createdBy.id !== req.user.id) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour modifier cette question',
        });
    }

    try {
        const updateQuestion = await questionService.update(
            req.question.id,
            req.body,
            req.user.id,
        );

        return res.status(200).send(updateQuestion);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError || error);
    }
};
