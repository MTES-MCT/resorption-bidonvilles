import shantytownService from '#server/services/shantytown';
import { TownInput } from '#server/services/shantytown/_common/serializeReport';
import { Request, Response, NextFunction } from 'express';
import { User } from '#root/types/resources/User.d';

interface ReportTownRequest extends Request {
    user: User,
    body: TownInput
}

const ERROR_RESPONSES = {
    sent_failed: { code: 502, message: 'L\'envoi du formulaire aux administrateurs nationaux a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

const { report } = shantytownService;

export default async (req: ReportTownRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await report(req.body, req.user);
        res.status(200).send({});
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError ?? error);
    }
};
