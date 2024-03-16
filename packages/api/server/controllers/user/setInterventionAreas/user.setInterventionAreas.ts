
import {
    type Request, type Response, type NextFunction,
} from 'express';
import setInterventionAreas from '#server/services/user/setInterventionAreas';
import { User } from '#root/types/resources/User.d';
import { InputInterventionArea } from '#root/types/inputs/InterventionArea.d';

interface UserSetInterventionAreasRequest extends Request {
    user: User,
    userToUpdate: User,
    body: {
        organization_areas: InputInterventionArea[],
        user_areas: InputInterventionArea[],
    }
}

export default async (req: UserSetInterventionAreasRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user.is_superuser !== true) {
            res.status(403).send({
                user_message: 'La modification des territoires d\'intervention est temporairement réservée aux administrateurs nationaux',
            });
            return;
        }        
        const user = await setInterventionAreas(
            req.user,
            req.userToUpdate,
            req.body.organization_areas,
            req.body.user_areas,
        );
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur inconnue est survenue',
        });
        next(error);
    }
};
