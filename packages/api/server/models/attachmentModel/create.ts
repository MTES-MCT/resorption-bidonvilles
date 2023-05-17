import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default async (key: string, name: string, mimetype: string, size: number, authorId: number, transaction?: Transaction): Promise<number> => {
    const data = await sequelize.query(
        `INSERT INTO attachments(original_file_key, preview_file_key, original_name, mimetype, size, created_by)
        VALUES (:key, :key, :name, :mimetype, :size, :authorId)
        RETURNING attachment_id`,
        {
            transaction,
            replacements: {
                key,
                name,
                mimetype,
                size,
                authorId,
            },
            type: QueryTypes.INSERT,
        },
    );

    type ReturnValue = { attachment_id: number };
    const rows: ReturnValue[] = (data[0] as unknown) as ReturnValue[];

    return rows[0].attachment_id;
};
