import { sequelize } from '#db/sequelize';
import shantytownModel from '#server/models/shantytownModel';
import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import can from '#server/utils/permission/can';
import sendMailForClosedTown from './_common/sendMailForClosedTown';

export default async (user: AuthUser, data) => {
    const shantytown = await shantytownModel.findOne(user, data.shantytown_id);

    if (!can(user).do('close', 'shantytown').on(shantytown)) {
        throw new ServiceError('closing_shantytown_not_allowed', new Error('Vous n\'êtes pas autorisé(e) à metttre à jour ce site'));
    }

    let updatedTown = null;
    const transaction = await sequelize.transaction();
    try {
        // close the town
        await shantytownModel.update(
            user,
            data.shantytown_id,
            {
                closed_at: data.closed_at,
                closed_with_solutions: data.closed_with_solutions,
                status: data.status,
                closing_context: data.closing_context,
                closing_solutions: data.solutions,
                updated_at: new Date(),
            },
            transaction,
        );
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('update_failed', error);
    }

    try {
        // Anonymise le nom du propriétaire du site fermé
        await shantytownModel.anonymizeOwner(data.shantytown_id, transaction);
        updatedTown = await shantytownModel.findOne(user, data.shantytown_id);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('anonymisation_failed', error);
    }
    await transaction.commit();

    // Send a mattermost alert, if it fails, do nothing
    try {
        await mattermostUtils.triggerShantytownCloseAlert(updatedTown, user);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`L'envoi de la notification de fermeture du site a échoué: ${err.message}`);
    }
    // Send a notification to all users of the related departement, if it fails, do nothing
    try {
        await sendMailForClosedTown(data.shantytown, updatedTown, user);
    } catch (ignore) {
        // ignore
    }
    return updatedTown;
};
