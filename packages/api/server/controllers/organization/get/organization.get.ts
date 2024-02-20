import { type Request, type Response, type NextFunction } from 'express';
import { Organization } from '#root/types/resources/Organization.d';

interface OrganizationGetRequest extends Request {
    organization: Organization,
}

export default async (req: OrganizationGetRequest, res: Response, next: NextFunction) => {
    if (req.params.id === 'search') {
        next('route');
        return;
    }

    try {
        res.status(200).send(req.organization);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        next(error);
    }
};
