import searchAssociations from '#server/services/organization/searchAssociations/searchAssociations';
import { Request, NextFunction, Response } from 'express';

interface AssociationSearchRequest extends Request {
    query: {
        query: string,
    }
}

export default async (req: AssociationSearchRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await searchAssociations(
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
