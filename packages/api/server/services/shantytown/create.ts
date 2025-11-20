import { sequelize } from '#db/sequelize';
import createShantytown from '#server/models/shantytownModel/create';
import findOneShantytown from '#server/models/shantytownModel/findOne';
import insertSocialOrigin from '#server/models/socialOriginModel/create';
import insertToiletType from '#server/models/shantytownToiletTypesModel/create';
import insertElectricityAccessType from '#server/models/electricityAccessTypesModel/create';
import shantytownParcelOwnerService from '#server/services/shantytownParcelOwner';
import insertIncomingTown from '#server/models/incomingTownsModel/create';
import getLocationWatchers from '#server/models/userModel/getLocationWatchers';
import { triggerShantytownCreationAlert } from '#server/utils/mattermost';
import baseShantytown from '#server/services/shantytown/_common/baseShantytown';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { TownInput } from './_common/serializeReport';

export default async (townData: TownInput, user: AuthUser) => {
    const baseTown = baseShantytown(townData, user);

    const transaction = await sequelize.transaction();
    let shantytown_id: number;
    try {
        shantytown_id = await createShantytown(
            {
                ...baseTown,
                ...(user.isAllowedTo('access', 'shantytown_justice')
                    ? {
                        ownerComplaint: townData.owner_complaint,
                        justiceProcedure: townData.justice_procedure,
                        justiceRendered: townData.justice_rendered,
                        justiceRenderedBy: townData.justice_rendered_by,
                        justiceRenderedAt: townData.justice_rendered_at,
                        justiceChallenged: townData.justice_challenged,
                        policeStatus: townData.police_status,
                        policeRequestedAt: townData.police_requested_at,
                        policeGrantedAt: townData.police_granted_at,
                        bailiff: townData.bailiff,
                    }
                    : {}),
            },
            transaction,
        );

        const promises = [];
        if (townData.social_origins.length > 0) {
            promises.push(insertSocialOrigin(shantytown_id, townData.social_origins, transaction));
        }

        if (townData.sanitary_toilet_types.length > 0) {
            promises.push(insertToiletType(
                shantytown_id,
                townData.sanitary_toilet_types,
                transaction,
            ));
        }

        if (townData.electricity_access_types.length > 0) {
            promises.push(insertElectricityAccessType(
                shantytown_id,
                townData.electricity_access_types,
                transaction,
            ));
        }

        if (townData.reinstallation_incoming_towns_full.length > 0) {
            promises.push(insertIncomingTown(
                shantytown_id,
                townData.reinstallation_incoming_towns_full.map(({ id }) => id),
                transaction,
            ));
        }

        // On ajoute les propriétaires de parcelles liés au site
        if (townData.owners && townData.owners.length > 0) {
            try {
                await shantytownParcelOwnerService.create(
                    user,
                    shantytown_id,
                    townData.owners,
                    transaction,
                );
            } catch (error) {
                await transaction.rollback();
                throw new ServiceError('parcel_owner_creation_failed', error);
            }
        }

        await Promise.all(promises);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

    const town = await findOneShantytown(user, shantytown_id);

    // Send a Mattermost alert, if it fails, do nothing
    try {
        await triggerShantytownCreationAlert(town, user);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Error with shantytown creation Mattermost webhook : ${err.message}`);
    }

    // Send a notification to all users of the related departement
    try {
        const watchers = await getLocationWatchers(townData.city, 'shantytown_creation');
        watchers
            .filter(({ user_id }: any) => user_id !== user.id) // do not send an email to the user who created the town
            .forEach((watcher) => {
                mails.sendUserShantytownDeclared(watcher, {
                    variables: {
                        departement: townData.city.departement,
                        shantytown: town,
                        creator: user,
                    },
                    preserveRecipient: false,
                });
            });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error sending shantytown creation email: ${error.message}`);
    }

    return town;
};
