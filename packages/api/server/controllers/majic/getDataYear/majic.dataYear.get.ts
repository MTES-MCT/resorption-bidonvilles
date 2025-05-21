import { NextFunction, Request, Response } from 'express';
import majicService from '#server/services/majic';
import { AuthUser } from '#server/middlewares/authMiddleware';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400 },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface MajicParcelGetRequest extends Request {
    user: AuthUser,
}

export default async (req: MajicParcelGetRequest, res: Response, next: NextFunction) => {
    const {
        departmentid,
    } = req.query;

    const { user } = req;
    let dataYear: string;

    try {
        dataYear = await majicService.getDataYear(departmentid as string, user);
    } catch (error) {
        const { code } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: `${error.nativeError?.message ?? error.message ?? 'Une erreur inconnue est survenue'}`,
        });
        return next(error.nativeError || error);
    }
    return res.status(200).send(dataYear);
};
