const createPlan = require('#server/services/plan/create');

const ERROR_RESPONSES = {
    departement_read_error: {
        code: 500,
        message: 'Une erreur de lecture en base de données est survenue',
    },
    financeType_read_error: {
        code: 500,
        message: 'Une erreur de lecture en base de données est survenue',
    },
    topic_read_error: {
        code: 500,
        message: 'Une erreur de lecture en base de données est survenue',
    },
    insert_error: {
        code: 500,
        message: 'Une erreur est survenue lors de l\'écriture en base de données',
    },
};

module.exports = async (req, res, next) => {
    let plan;

    try {
        plan = await createPlan(req.body, req.user);
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

    return res.status(200).send(plan);
};
