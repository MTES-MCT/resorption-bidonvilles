import { sequelize } from '#db/sequelize';

export default async (note_id: string, created_from: string, number_of_copies: number, created_by: number, created_at: string): Promise<any> => sequelize.query(
    `INSERT INTO notes
        (
            note_id,
            created_from,
            number_of_copies,
            created_by,
            created_at
        )
        VALUES(
            :note_id, 
            :created_from,
            :number_of_copies,
            :created_by, 
            :created_at
        )`,
    {
        replacements: {
            note_id,
            created_from,
            number_of_copies,
            created_by,
            created_at,
        },
    },
);
