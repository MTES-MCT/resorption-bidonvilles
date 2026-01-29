import signinLogModel from '#server/models/signinLogModel';

export default async (req, res, next) => {
    try {
        const filters: any = {};

        if (req.query.email) {
            filters.email = req.query.email;
        }

        if (req.query.ipAddress) {
            filters.ipAddress = req.query.ipAddress;
        }

        if (req.query.success !== undefined) {
            filters.success = req.query.success === 'true';
        }

        if (req.query.dateFrom) {
            filters.dateFrom = new Date(req.query.dateFrom);
        }

        if (req.query.dateTo) {
            filters.dateTo = new Date(req.query.dateTo);
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
