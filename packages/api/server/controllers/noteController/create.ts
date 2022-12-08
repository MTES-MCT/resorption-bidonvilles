import note from '#server/services/note/index';

const ERROR_RESPONSES = {
    insert_failed: 'La note n\'a pas pu être enregistrée.',
    undefined: 'Une erreur inconnue est survenue.',
};

export default async (req, res, next) => {
    try {
        await note.create(
            req.body.note_id,
            req.body.created_from,
            req.body.number_of_copies,
            req.user.id,
            req.body.created_at,
        );
    } catch (error) {
        res.status(500).send({
            user_message: ERROR_RESPONSES[error?.code] || ERROR_RESPONSES.undefined,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(201).send({
        noteId: req.body.note_id,
    });
};
