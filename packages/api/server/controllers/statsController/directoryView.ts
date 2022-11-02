import organizationModelFactory from '#server/models/organizationModel/index';
import statsDirectoryViewsModelFactory from '#server/models/statsDirectoryViews';

const organizationModel = organizationModelFactory();
const statsDirectoryViewsModel = statsDirectoryViewsModelFactory();

export default async (req, res, next) => {
    const organizationId = parseInt(req.body.organization, 10);

    try {
        const organization = await organizationModel.findOneById(organizationId);

        if (organization === null) {
            return res.status(400).send({
                success: false,
                response: {
                    error: {
                        user_message: 'La structure consultée n\'a pas été trouvéee en base de données',
                    },
                },
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            response: {
                error: {
                    user_message: 'Une erreur est survenue lors de la lecture en base de données',
                },
            },
        });
        return next(error);
    }

    try {
        await statsDirectoryViewsModel.create(
            organizationId,
            req.user.id,
        );
    } catch (error) {
        res.status(500).send({
            success: false,
            response: {
                error: {
                    user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                },
            },
        });
        return next(error);
    }

    return res.status(201).send({});
};
