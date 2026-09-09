import { Request, Response, NextFunction } from 'express';
import geoModel from '#server/models/geoModel';

const getEpciDepartements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departements = await geoModel.getDepartementsForEpci(req.params.code);
        return res.status(200).send(departements);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};

export default getEpciDepartements;
