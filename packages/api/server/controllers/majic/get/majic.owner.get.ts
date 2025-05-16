import { NextFunction, Request, Response } from 'express';
import majicService from '#server/services/majic';
import { AuthUser } from '#server/middlewares/authMiddleware';

const ERROR_RESPONSES = {
    permission_denied: { code: 403 },
    log_insert_failed: { code: 400 },
    parcel_fetch_failed: { code: 400 },
    owner_fetch_failed: { code: 400 },
    owners_fetch_failed: { code: 400 },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface majicParcelGetRequest extends Request {
    user: AuthUser,
}

export default async (req: majicParcelGetRequest, res: Response, next: NextFunction) => {
    const {
        parcelid,
        departmentid,
    } = req.query;

    const { user } = req;

    try {
        await majicService.find(parcelid as string, departmentid as string, user);
    } catch (error) {
        const { code } = ERROR_RESPONSES[error?.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: `${error.nativeError?.message || error.message || 'Une erreur inconnue est survenue'}`,
        });
        return next(error.nativeError || error);
    }
    return res.status(200).send();
};
