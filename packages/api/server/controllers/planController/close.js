const { trim } = require('validator');
const sequelize = require('#db/sequelize');
const planModel = require('#server/models/planModel');
const historize = require('./_common/historize');

function sanitizeClose(data) {
    const sanitizedData = {};

    // closed at
    const closedAt = new Date(data.closedAt);
    if (!Number.isNaN(closedAt.getTime())) {
        sanitizedData.closedAt = closedAt;
    }

    // comment
    if (typeof data.comment === 'string') {
        sanitizedData.comment = trim(data.comment);
    }

    // fundings
    if (Array.isArray(data.finances)) {
        sanitizedData.finances = data.finances
            .filter(({ data: d }) => d && d.length > 0)
            .map(({ year, data: d }) => ({
                year: parseInt(year, 10),
                data: d.map(({
                    type, amount, realAmount, details,
                }) => ({
                    type: type !== null ? type : null,
                    amount: parseFloat(amount),
                    realAmount: realAmount ? parseFloat(realAmount) : null,
                    details: trim(details),
                })),
            }));
    }

    return sanitizedData;
}

module.exports = async (req, res, next) => {
    // check existence of the plan (otherwise, 404)
    let plan;
    try {
        plan = await planModel.findOne(req.user, req.params.id);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
        return next(error);
    }

    if (plan === null) {
        return res.status(404).send({
            error: {
                user_message: 'L\'action à mettre à jour n\'a pas été trouvée en base de données',
            },
        });
    }

    // check the geographic level of the 'close' permission (we assume here that the user has that permission)
    if (plan.canClose !== true) {
        return res.status(400).send({
            error: {
                user_message: 'Vous n\'avez pas les droits nécessaires pour fermer cette action',
            },
        });
    }

    // ensure the plan is not already closed (otherwise, 400)
    if (plan.closed_at !== null) {
        return res.status(400).send({
            error: {
                user_message: 'Cette action est déjà fermée',
            },
        });
    }

    // check the input
    const planData = Object.assign({}, sanitizeClose(req.body.data), {
        updatedBy: req.user.id,
    });

    const errors = {};
    function addError(field, error) {
        if (errors[field] === undefined) {
            errors[field] = [];
        }

        errors[field].push(error);
    }

    // find all missing realAmount entries and ensure they were sent and are valid (ie., they are floats > 0 && <= to amount)
    function extractRealAmount(year, type, amount) {
        const finance = planData.finances.find(({ year: y }) => y === year);
        if (!finance) {
            return null;
        }

        const index = finance.data.findIndex(({ amount: a, type: t }) => a === amount && t === type);
        const [{ realAmount }] = finance.data.splice(index, 1);

        return realAmount;
    }

    const cleanFinances = plan.finances.map(finance => Object.assign({}, finance, {
        data: finance.data.map((row) => {
            const realAmount = extractRealAmount(finance.year, row.type.uid, row.amount);
            if (row.realAmount !== null) {
                return Object.assign({}, row, {
                    type: row.type.uid,
                });
            }

            if (realAmount < 0) {
                addError('finances', `Financements ${finance.year} : les dépenses exécutées ne peuvent pas être négatives`);
            } else if (realAmount > row.amount) {
                addError('finances', `Financements ${finance.year} : les dépenses exécutées ne peuvent pas être supérieures au montant du financement`);
            }

            return Object.assign({}, row, {
                type: row.type.uid,
                realAmount,
            });
        }),
    }));

    if (planData.finances.some(({ data }) => data.length > 0)) {
        addError('finances', 'Le tableau de financement ne peut pas être modifié, à l\'exception des dépenses exécutées');
    } else {
        planData.finances = cleanFinances;
    }

    // ensure the closed date is provided and is > startedAt and <= today
    if (planData.closedAt === undefined) {
        addError('closedAt', 'La date de fermeture est obligatoire');
    } else if (planData.closedAt >= new Date()) {
        addError('closedAt', 'La date de fermeture ne peut pas être future');
    } else if (planData.closedAt <= new Date(plan.started_at)) {
        addError('closedAt', 'La date de fermeture ne peut pas être antérieure à la date de début de l\'action');
    }

    // ensure the comment is not empty
    if (planData.comment === undefined || planData.comment === '') {
        addError('comment', 'Le commentaire est obligatoire');
    }

    // in case of error => 400 + details
    if (Object.keys(errors).length > 0) {
        return res.status(400).send({
            error: {
                user_message: 'Certaines données sont invalides',
                fields: errors,
            },
        });
    }

    // start a transaction
    try {
        await sequelize.transaction(async (t) => {
            // save current state into history
            await historize(plan.id, t);

            // update
            await sequelize.query(
                'UPDATE plans2 SET closed_at = :closedAt, final_comment = :comment, updated_by = :updatedBy WHERE plan_id = :planId',
                {
                    replacements: Object.assign({}, planData, { planId: plan.id }),
                    transaction: t,
                },
            );

            // reset finances
            await sequelize.query('DELETE FROM finances WHERE fk_plan = :planId', { replacements: { planId: plan.id }, transaction: t });

            // insert into finances
            const financeIds = await Promise.all(
                planData.finances.map(({ year }) => sequelize.query(
                    'INSERT INTO finances(fk_plan, year, created_by) VALUES (:planId, :year, :createdBy) RETURNING finance_id AS id',
                    {
                        replacements: {
                            planId: plan.id,
                            year,
                            createdBy: req.user.id,
                        },
                        transaction: t,
                    },
                )),
            );

            // insert into finance_rows
            return Promise.all(
                planData.finances.reduce((acc, { data }, index) => [
                    ...acc,
                    ...data.map(({
                        amount, realAmount, type, details,
                    }) => sequelize.query(
                        `INSERT INTO finance_rows(fk_finance, fk_finance_type, amount, real_amount, comments, created_by)
                        VALUES (:financeId, :type, :amount, :realAmount, :comments, :createdBy)`,
                        {
                            replacements: {
                                financeId: financeIds[index][0][0].id,
                                type,
                                amount,
                                realAmount,
                                comments: details,
                                createdBy: req.user.id,
                            },
                            transaction: t,
                        },
                    )),
                ], []),
            );
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            },
        });
        return next(error);
    }

    return res.status(200).send({});
};
