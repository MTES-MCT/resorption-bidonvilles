import searchPrivateOrganization from '#server/services/organization/searchPrivateOrganizations/searchPrivateOrganizations';
import { Request, NextFunction, Response } from 'express';

interface PrivateOrganizationSearchRequest extends Request {
    query: {
        query: string,
    }
}

export default async (req: PrivateOrganizationSearchRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await searchPrivateOrganization(
            req.query.query,
        );
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });

        next(error.nativeError);
    }
};
