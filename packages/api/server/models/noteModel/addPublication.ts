import { sequelize } from '#db/sequelize';

export default (fk_note: string, fk_shantytown: number, created_at: string): Promise<any> => sequelize.query(
    `INSERT INTO notes_publications
        (
            fk_note,
            fk_shantytown,
            created_at
        )
        VALUES(
            :fk_note,
            :fk_shantytown, 
            :created_at
        )`,
    {
        replacements: {
            fk_note,
            fk_shantytown,
            created_at,
        },
    },
);
