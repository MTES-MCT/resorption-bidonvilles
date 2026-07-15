import { AuthUser } from '#server/middlewares/authMiddleware';
import { type Request } from 'express';

export interface ManageFavoriteRequest extends Request {
    user: AuthUser;
    params: {
        id: string;
    };
}
