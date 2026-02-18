import { Request, Response, NextFunction } from 'express';
import signinLogModel from '#server/models/signinLogModel';
import { SigninLogFilters } from '#root/types/resources/SigninLogFilters.d';


const signinLogListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters: SigninLogFilters = {};

        if (req.query.email) {
            filters.email = typeof req.query.email === 'string' ? req.query.email : undefined;
        }

        if (req.query.ipAddress) {
            filters.ipAddress = typeof req.query.ipAddress === 'string' ? req.query.ipAddress : undefined;
        }

        if (req.query.success !== undefined) {
            filters.success = req.query.success === 'true';
        }

        if (req.query.dateFrom) {
            const date = new Date(String(req.query.dateFrom));
            if (!Number.isNaN(date.getTime())) {
                filters.dateFrom = date;
            }
        }

        if (req.query.dateTo) {
            const date = new Date(String(req.query.dateTo));
            if (!Number.isNaN(date.getTime())) {
                filters.dateTo = date;
            }
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
