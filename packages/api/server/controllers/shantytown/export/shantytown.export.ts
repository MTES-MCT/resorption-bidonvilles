import exportShantytown from '#server/services/shantytown/export';

export default async (req, res, next) => {
    let buffer;
    try {
        buffer = await exportShantytown(req.user, req.shantytown, req.query.options);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur inconnue est survenue',
        });
        next(error.nativeError ?? error);
        return res;
    }

    return res.end(buffer);
};
