import organizationService from '#server/services/organization/organizationService';
import { Request, NextFunction, Response } from 'express';

interface OrganizationSearchRequest extends Request {
    query: {
        query: string,
        departementCode: string | null,
        usersOnly: string,
    }
}

export default async (req: OrganizationSearchRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await organizationService.search(
            req.query.query,
            req.query.departementCode,
            req.query.usersOnly === '1',
        );
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });

        next(error.nativeError);
    }
};
