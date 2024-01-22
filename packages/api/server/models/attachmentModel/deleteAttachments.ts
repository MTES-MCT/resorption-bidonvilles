import { Transaction, QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default async (commentId: number, entityType: string, transaction: Transaction): Promise<number[]> => {
    try {
    // Récupérer les identifiants des attachments avant la suppression
        const selectedIdsResult = await sequelize.query(
            `SELECT ${entityType}_attachments.fk_attachment FROM ${entityType}_attachments WHERE ${entityType}_attachments.fk_${entityType} = :commentId`,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    commentId,
                },
                transaction,
            },
        );
        const selectedIds = selectedIdsResult.map((row: any) => row.fk_attachment);

        // Supprimer les enregistrements dans la table attachments et par cascade dans les tables de jointure
        await sequelize.query(
            'DELETE FROM attachments WHERE attachment_id IN (:selectedIds)',
            {
                type: QueryTypes.DELETE,
                replacements: {
                    selectedIds,
                },
                transaction,
            },
        );

        // Retourner les identifiants supprimés
        return selectedIds;
    } catch (error) {
        throw error;
    }
};
