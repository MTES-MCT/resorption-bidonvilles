import organizationService from '#server/services/organization/organizationService';
import { Request, NextFunction, Response } from 'express';

interface OrganizationSearchActionOperatorsRequest extends Request {
    query: {
        query: string,
    }
}

export default async function searchActionOperators(req: OrganizationSearchActionOperatorsRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await organizationService.searchActionOperators(req.query.query);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });

        next(error.nativeError);
    }
}
