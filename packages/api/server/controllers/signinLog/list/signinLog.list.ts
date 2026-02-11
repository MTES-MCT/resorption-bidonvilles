import { Request, Response, NextFunction } from 'express';
import signinLogModel from '#server/models/signinLogModel';
import { SigninLogFilters } from '#root/types/resources/SigninLogFilters.d';

const signinLogListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters: SigninLogFilters = {};

        if (req.query.email) {
            filters.email = req.query.email as string;
        }

        if (req.query.ipAddress) {
            filters.ipAddress = req.query.ipAddress as string;
        }

        if (req.query.success !== undefined) {
            filters.success = req.query.success === 'true';
        }

        if (req.query.dateFrom) {
            filters.dateFrom = new Date(req.query.dateFrom as string);
        }

        if (req.query.dateTo) {
            filters.dateTo = new Date(req.query.dateTo as string);
        }

        const logs = await signinLogModel.findAll(filters);
        return res.status(200).send(logs);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la récupération des logs de connexion',
        });
        return next(error);
    }
};

export default signinLogListController;
