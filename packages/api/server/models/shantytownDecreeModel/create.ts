import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';

type InsertDecreeData = {
    shantytownId: number;
    attachmentId: number;
};

export default async (datas: InsertDecreeData, transaction: Transaction = null): Promise<number> => {
    const [decreeId]: [number, number] = await sequelize.query(
        `INSERT INTO shantytown_decrees(
            fk_shantytown,
            fk_attachment
        )
        VALUES (:shantytownId, :attachmentId)
        RETURNING shantytown_decree_id`,
        {
            replacements: { shantytownId: datas.shantytownId, attachmentId: datas.attachmentId },
            transaction,
            type: QueryTypes.INSERT,
        },
    );

    if (decreeId) {
        return decreeId;
    }
    throw new ServiceError('insert_failed', new Error('Impossible de créer le décret en base de données'));
};
