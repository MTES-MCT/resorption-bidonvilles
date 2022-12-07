import { sequelize } from '#db/sequelize';

export default async (noteId) => {
    await sequelize.query(
        `UPDATE
            notes
        SET
            number_of_copies = number_of_copies + 1
        WHERE
            notes.note_id = '${noteId}'`
    );
};