import note from '#server/services/note/index';

export default async (req, res, next) => {

    let noteId: string;

    try {
        noteId = await note.create(
            req.body.note_id,
            req.body.created_from,
            req.body.number_of_copies,
            req.body.created_by,
            req.body.created_at
        );
    } catch (error) {
        console.log(error);
        let message;
        switch (error && error.code) {
            case 'insert_failed':
                message = 'La note n\'a pas pu être enregistrée.';
                break;

            default:
                message = 'Une erreur inconnue est survenue.';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(201).send({
        noteId,
    });
};
