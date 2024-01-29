import { type NextFunction, Request, Response } from 'express';
import { User } from '#root/types/resources/User.d';

interface AuthenticatedRequest extends Request {
    user: User,
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user.charte_engagement_a_jour === false) {
        res.status(400).send({
            user_message: 'La charte d\'engagement doit être signée',
        });
        return;
    }

    next();
};
