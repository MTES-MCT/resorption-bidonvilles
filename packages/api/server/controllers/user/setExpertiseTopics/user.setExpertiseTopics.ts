import userService from '#server/services/user/index';
import { Request, NextFunction, Response } from 'express';
import { User } from '#root/types/resources/User.d';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    user_update_failure: { code: 500, message: 'Une erreur est survenue lors de la mise à jour du compte' },
    topics_save_failure: { code: 500, message: 'Une erreur est survenue lors de l\'enregistrement des sujets en base de données' },
    user_search_failure: { code: 500, message: 'Une erreur est survenue lors de la recherche de l\'utilisateur en base de données' },
    transaction_failure: { code: 500, message: 'Une erreur est survenue lors de la validation de la mise à jour' },
};

interface UserSetTagsRequest extends Request {
    body: {
        user: User;
        expertise_topics: string[];
        interest_topics: string[];
        expertise_comment: string | null;
    };
}

export default async (req: UserSetTagsRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userService.setExpertiseTopics(req.body.user.id, req.body.expertise_topics, req.body.interest_topics, req.body.expertise_comment);
        res.status(200).send(user);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError ?? error);
    }
};
