import { Request, Response, NextFunction } from 'express';
import permissionService from '#server/services/permission/index';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const permissions = await permissionService.listByRoles();
        res.status(200).send(permissions);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur inconnue est survenue',
        });
        next(error?.nativeError || error);
    }
};
