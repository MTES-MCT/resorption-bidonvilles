

const { toFormat: dateToString } = require('#server/utils/date');
const { exportTown } = require('#server/services/shantytown');


module.exports = async (req, res, next) => {
    const closedTowns = parseInt(req.query.closedTowns, 10) === 1;
    let buffer;
    try {
        buffer = await exportTown(req.user, req.query);
    } catch (error) {
        if (error && error.code === 'fetch_failed') {
            return res.status(404).send({
                error: error.nativeError,
            });
        } if (error && error.code === 'access_denied') {
            return res.status(403).send({
                error: error.nativeError,
            });
        } if (error && error.code === 'write_failed') {
            return res.status(500).send({
                error: error.nativeError,
            });
        }
        res.status(500).send({
            success: false,
            response: {
                error: {
                    user_message: 'Une erreur est survenue pendant l\'export des sites en base de données',
                    developer_message: error.message,
                },
            },
        });
        next(error);
    }
    res.attachment(`${dateToString(new Date(), 'Y-m-d')}-sites-${closedTowns ? 'fermés' : 'existants'}-resorption-bidonvilles.xlsx`);
    return res.end(buffer);
};
