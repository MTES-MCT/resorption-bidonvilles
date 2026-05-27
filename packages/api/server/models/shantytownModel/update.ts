import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownUpdateData } from './_common/types/ShantytownUpdateData.d';
import archiveShantytownHistory from './_common/updateHelpers/archiveShantytownHistory';
import archiveRelatedData from './_common/updateHelpers/archiveRelatedData';
import partitionShantytownData from './_common/updateHelpers/partitionShantytownData';
import updateMainShantytown from './_common/updateHelpers/updateMainShantytown';
import updateShantytownRelations from './_common/updateHelpers/updateShantytownRelations';

export default async function update(
    editor: AuthUser,
    shantytownId: number,
    data: ShantytownUpdateData,
    argTransaction: Transaction = undefined,
): Promise<number> {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    try {
        // Archive l'état actuel du shantytown
        const hid = await archiveShantytownHistory(shantytownId, transaction);

        // Archive les données relationnelles
        await archiveRelatedData(hid, shantytownId, transaction);

        // Répartit les données selon les permissions
        const { commonData, justiceData, ownerData } = partitionShantytownData(data);

        const updatedTown = {
            ...commonData,
            updated_by: editor.id,
            ...(editor.isAllowedTo('access', 'shantytown_justice') ? justiceData : {}),
            ...(editor.isAllowedTo('access', 'shantytown_owner') ? ownerData : {}),
        };

        // Met à jour le shantytown principal
        await updateMainShantytown(shantytownId, updatedTown, transaction);

        // Met à jour les relations
        await updateShantytownRelations(shantytownId, data, transaction);

        if (argTransaction === undefined) {
            await transaction.commit();
        }

        return hid;
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }

        throw error;
    }
}
