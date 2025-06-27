import { Request, Response, NextFunction } from 'express';
import permissionService from '#server/services/permission/index';
import { User } from '#root/types/resources/User.d';

interface ListRolePermissionRequest extends Request {
    user: User,
}

export default async (req: ListRolePermissionRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.user.is_superuser !== true) {
        res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants',
        });
        return;
    }

    try {
        const permissions = await permissionService.listByRoles();
        res.status(200).send(permissions);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur inconnue est survenue',
        });
        next(error?.nativeError ?? error);
    }
};
