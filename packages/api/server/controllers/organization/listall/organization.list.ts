import organizationService from '#server/services/organization/organizationService';
import { Request, NextFunction, Response } from 'express';

interface OrganizationSearchRequest extends Request {
    query: {
        query: string,
    }
}

const listAll = async (req: OrganizationSearchRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await organizationService.listAll(
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

export default listAll;
