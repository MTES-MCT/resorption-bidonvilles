import questionService from '#server/services/question';
import { Request, NextFunction, Response } from 'express';
import { User } from '#root/types/resources/User.d';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';

interface UnsubscribeQuestionRequest extends Request {
    params: {
        id: string,
    },
    user: User,
    question: EnrichedQuestion
}

const ERROR_RESPONSES = {
    write_failed: { code: 500, message: 'L\'écriture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req: UnsubscribeQuestionRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await questionService.unsubscribe(req.user, req.question.id);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError ?? error);
    }

    res.status(200).send({});
};
