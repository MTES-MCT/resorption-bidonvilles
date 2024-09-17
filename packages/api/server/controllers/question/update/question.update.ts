import questionService from '#server/services/question';
import { Request } from 'express';
import enrichQuestion from '#server/services/question/common/enrichQuestion';
import { User } from '#root/types/resources/User.d';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';

interface QuestionUpdateRequest extends Request {
    user: User;
    question: EnrichedQuestion;
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
        const updatedQuestion = await questionService.update(
            req.question.id,
            req.body,
            req.user.id,
        );

        // Ajout des éventuelles pièces jointes
        const enrichedQuestion = await enrichQuestion(updatedQuestion.id);

        return res.status(200).send(enrichedQuestion);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError || error);
    }
};
