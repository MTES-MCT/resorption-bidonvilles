import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default ids => sequelize.query(
    `SELECT
        notes.note_id AS id,
        notes.created_from,
        notes.number_of_copies,
        notes.created_by,
        notes.created_at
    FROM notes
    WHERE notes.note_id IN (:ids)`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            ids,
        },
    },
);
