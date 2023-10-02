import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import userService from '#server/services/user/index';

export default async (req, res) => {
    // create the user
    let result: SerializedUser;
    try {
        result = await userService.create(
            {
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                email: req.body.email,
                phone: req.body.phone || null,
                organization: req.body.organization_full ? req.body.organization_full.id : null,
                new_association: req.body.new_association === true,
                new_association_name: req.body.new_association_name || null,
                new_association_abbreviation: req.body.new_association_abbreviation || null,
                departement: req.body.departement || null,
                position: req.body.position,
                access_request_message: null,
            },
            req.user.id,
        );
    } catch (error) {
        return res.status(500).send('Une erreur est survenue lors de l\'écriture en base de données');
    }

    return res.status(200).send(result);
};
