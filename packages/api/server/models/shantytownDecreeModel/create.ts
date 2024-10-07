import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
// import { ShantytownDecree } from '#server/types/resources/ShantytownDecree.d';

type ShantytownDecreeLink = {
    shantytown_decree_id: number;
    fk_shantytown: number;
    fk_attachment: number;
};
// export default async (decree, shantytown, author): Promise<{ decrees: ShantytownDecree[] }> => true;
export default async (datas, transaction = null): Promise<number> => {
    const [decrees]: [ShantytownDecreeLink[], unknown] = await sequelize.query<ShantytownDecreeLink>(
        `INSERT INTO shantytown_decrees(
            fk_shantytown,
            fk_attachment
        )
        VALUES (
            :shantytown_id,
            :attachment_id
        )
        RETURNING shantytown_decree_id`,
        {
            replacements: datas,
            transaction,
        },
    );

    if (decrees.length > 0 && decrees[0].shantytown_decree_id) {
        return decrees[0].shantytown_decree_id;
    }
    throw new ServiceError('insert_failed', new Error('Impossible de créer le décret en base de données'));
};
