import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default (ids: number[]): Promise<void> => sequelize.query(
    'DELETE FROM deleted_attachments WHERE attachment_id IN (:ids)',
    {
        type: QueryTypes.DELETE,
        replacements: { ids },
    },
);
