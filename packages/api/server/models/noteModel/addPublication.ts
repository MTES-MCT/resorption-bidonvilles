import { sequelize } from "#db/sequelize";

export default async (fk_note: string, fk_shantytown: number, created_at: string): Promise<string> => {

    const response: any = await sequelize.query(
        `INSERT INTO notes_publications
            (
                fk_note, fk_shantytown, created_at
            )
            VALUES(
                :fk_note,
                :fk_shantytown, 
                :created_at
            )
            
            RETURNING fk_note`,
        {
            replacements: {
                fk_note,
                fk_shantytown,
                created_at,
            },
        },
    );

    return response[0][0].fk_note;
};