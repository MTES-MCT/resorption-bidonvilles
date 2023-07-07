import { Request, NextFunction, Response } from 'express';
import questionService from '#server/services/question';

interface QuestionSearchRequest extends Request {
    query: {
        query: string,
    }
}


const ERROR_RESPONSES = {
    db_read_error: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};
export default async (req: QuestionSearchRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await questionService.search(
            req.query.query,
        );
        res.status(200).send(result);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }
};
