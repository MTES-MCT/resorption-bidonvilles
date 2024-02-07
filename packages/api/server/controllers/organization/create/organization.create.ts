import { NextFunction, Request, Response } from 'express';
import createOrganization, { type OrganizationCreateInput } from '#server/services/organization/create';
import { OrganizationRaw } from '#server/models/organizationModel/findByIds';
import { User } from '#root/types/resources/User.d';

interface OrganizationCreateRequest extends Request {
    user: User,
    body: OrganizationCreateInput
}

export default async (req: OrganizationCreateRequest, res: Response, next: NextFunction) => {
    if (!req.user.is_admin) {
        res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour créer une structure',
        });
        return;
    }

    let organization: OrganizationRaw;
    try {
        organization = await createOrganization(
            req.user.id,
            req.body,
        );
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
        next(error);
        return;
    }

    res.status(200).send(organization);
};
