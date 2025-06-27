import semver from 'semver';
import userModel from '#server/models/userModel';
import { type NextFunction, Request, Response } from 'express';
import { User } from '#root/types/resources/User.d';

interface AuthenticatedRequest extends Request {
    user: User,
}

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const version = req.headers?.['x-app-version'] as string;
    const lastUsedVersion = req.user.last_version;

    let updateUser = false;
    if (lastUsedVersion !== null) {
        try {
            updateUser = semver.lt(req.user.last_version, version);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(400).send({
                user_message: 'Votre version actuelle de la plateforme n\'est pas reconnue',
            });
            return;
        }
    } else {
        updateUser = true;
    }

    if (updateUser === true) {
        try {
            await userModel.update(req.user.id, {
                last_version: version,
                last_changelog: !req.user.last_changelog ? version : undefined,
            });
            req.user.last_version = version;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    next();
};
