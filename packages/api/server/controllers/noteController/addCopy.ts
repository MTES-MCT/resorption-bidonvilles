import noteService from '#server/services/note';

const ERROR_RESPONSES = {
    note_read_error: {
        code: 500,
        message: 'Une erreur de lecture en base de données est survenue',
    },
    update_error: {
        code: 500,
        message: 'Une erreur est survenue lors de l\'écriture en base de données',
    },
};

export default async (req, res, next) => {
    let updatedNote;
    try {
        updatedNote = await noteService.addCopy(req.params.id);
    } catch (error) {
        const response = ERROR_RESPONSES[error && error.code];
        if (!response) {
            return res.status(400).send({
                user_message: 'Certaines données sont invalides',
                fields: error,
            });
        }

        res.status(response.code).send({
            error: {
                user_message: response.message,
            },
        });
        return next(error.nativeError || error);
    }
    return res.status(200).send(updatedNote);
};