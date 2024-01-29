import userService from '#server/services/user/index';
import { User } from '#root/types/resources/User.d';

export default async (req, res) => {
    // create the user
    let result: User;
    try {
        result = await userService.create(
            {
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                email: req.body.email,
                phone: req.body.phone || null,
                organization: req.body.organization_full ? req.body.organization_full.id : null,
                position: req.body.position,
                access_request_message: null,
            },
            req.user.id,
        );
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
    }

    return res.status(200).send(result);
};
