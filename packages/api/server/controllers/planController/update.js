const sequelize = require('#db/sequelize');
const planModel = require('#server/models/planModel');
const financeTypeModel = require('#server/models/financeTypeModel');
const topicModel = require('#server/models/topicModel');
const userModel = require('#server/models/userModel');
const { addAttachments, removeAttachments } = require('#server/models/permissionModel');
const historize = require('./_common/historize');
const sanitize = require('./_common/sanitize');

module.exports = async (req, res, next) => {
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

    // sanitize data
    const planData = Object.assign({}, sanitize(req.body), {
        updatedBy: req.user.id,
    });

    // validate data
    const errors = {};
    function addError(field, error) {
        if (errors[field] === undefined) {
            errors[field] = [];
        }

        errors[field].push(error);
    }

    let financeTypes;
    try {
        financeTypes = (await financeTypeModel.findAll()).reduce((acc, type) => Object.assign({}, acc, {
            [type.uid]: type,
        }), {});
    } catch (error) {
        res.status(500).send({
            success: false,
            error: {
                user_message: 'Une erreur de lecture en base de données est survenue',
            },
        });
        return next(error);
    }

    let topics;
    try {
        topics = (await topicModel.findAll()).reduce((acc, topic) => Object.assign({}, acc, {
            [topic.uid]: topic,
        }), {});
    } catch (error) {
        res.status(500).send({
            success: false,
            error: {
                user_message: 'Une erreur de lecture en base de données est survenue',
            },
        });
        return next(error);
    }

    if (!planData.name) {
        addError('name', 'Le nom de l\'action est obligatoire');
    }

    if (!planData.startedAt) {
        addError('startedAt', 'La date de début de l\'action est obligatoire');
    }

    if (planData.expectedToEndAt && planData.expectedToEndAt <= planData.startedAt) {
        addError('expectedToEndAt', 'La date de fin de l\'action ne peut pas être antérieure à la date de début');
    }

    if (planData.topics.length === 0) {
        addError('topics', 'Vous devez sélectionner au moins une thématique');
    } else {
        const unknownTopics = planData.topics.filter(uid => topics[uid] === undefined);
        if (unknownTopics.length > 0) {
            addError('topics', `Les thématiques suivantes n'ont pas été reconnues : ${unknownTopics.join(', ')}`);
        }
    }

    if (!planData.goals) {
        addError('goals', 'Les objectifs sont obligatoires');
    }

    if (!planData.government) {
        addError('government', 'Vous devez désigner la personne en charge du pilotage de l\'action');
    } else {
        try {
            const user = await userModel.findOne(planData.government.id);
            if (user === null) {
                addError('government', 'La personne désignée comme pilote de l\'action n\'a pas été retrouvée en base de données');
            } else if (user.organization.category.uid !== 'public_establishment') {
                addError('government', 'Le pilote de l\'action doit faire partie d\'un service de l\'état');
            }
        } catch (error) {
            addError('government', 'Une erreur est survenue lors de la validation du pilote de l\'action');
        }
    }

    if (planData.finances) {
        planData.finances.forEach(({ year, data }) => {
            if (year > (new Date()).getFullYear()) {
                addError('finances', `Il est impossible de saisir les financements pour l'année ${year}`);
            } else {
                data.forEach(({ amount, type }, index) => {
                    const typeName = financeTypes[type] ? `'${financeTypes[type].name}'` : `de la ligne n°${index + 1}`;

                    if (!type) {
                        addError('finances', `Année ${year} : merci de préciser le type de financement pour la ligne n°${index + 1}`);
                    } else if (financeTypes[type] === undefined) {
                        addError('finances', `Année ${year} : le type de financement de la ligne n°${index + 1} n'est pas reconnu`);
                    }

                    if (Number.isNaN(amount)) {
                        addError('finances', `Année ${year} : le montant du financement ${typeName} est invalide`);
                    } else if (amount <= 0) {
                        addError('finances', `Année ${year} : le montant du financement ${typeName} ne peut pas être négatif ou nul`);
                    }
                });
            }
        });
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).send({
            success: false,
            error: {
                user_message: 'Certaines données sont invalides',
                fields: errors,
            },
        });
    }

    // update database
    try {
        await sequelize.transaction(async (t) => {
            // save current state into history
            await historize(plan.id, t);

            // update
            await sequelize.query(
                'UPDATE plans2 SET name = :name, started_at = :startedAt, expected_to_end_at = :expectedToEndAt, goals = :goals, updated_by = :updatedBy, updated_at = :updatedAt WHERE plan_id = :planId',
                {
                    replacements: {
                        ...planData,
                        planId: plan.id,
                        updatedAt: new Date(),
                    },
                    transaction: t,
                },
            );

            // reset shantytowns, finances and managers
            await Promise.all([
                sequelize.query('DELETE FROM plan_shantytowns WHERE fk_plan = :planId', { replacements: { planId: plan.id }, transaction: t }),
                sequelize.query('DELETE FROM finances WHERE fk_plan = :planId', { replacements: { planId: plan.id }, transaction: t }),
                sequelize.query('DELETE FROM plan_managers WHERE fk_plan = :planId', { replacements: { planId: plan.id }, transaction: t }),
                ...['list', 'read', 'update', 'close'].map(
                    feature => removeAttachments([{ type: 'plan', id: plan.id }])
                        .fromUser(plan.government_contacts[0].id)
                        .onFeature(feature, 'plan', t),
                ),
            ]);

            // insert into plan_shantytowns
            if (plan.location_type.id === 'shantytowns') {
                await sequelize.query(
                    `INSERT INTO plan_shantytowns(fk_plan, fk_shantytown, created_by)
                    VALUES ${planData.locationShantytowns.map(() => '(?, ?, ?)').join(', ')}`,
                    {
                        replacements: planData.locationShantytowns.reduce((acc, id) => [
                            ...acc,
                            plan.id,
                            id,
                            req.user.id,
                        ], []),
                        transaction: t,
                    },
                );
            }

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
            await Promise.all(
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

            // managers
            return Promise.all([
                sequelize.query(
                    `INSERT INTO plan_managers(fk_plan, fk_user, created_by)
                        VALUES (:planId, :userId, :createdBy)`,
                    {
                        replacements: {
                            planId: plan.id,
                            userId: planData.government.id,
                            createdBy: req.user.id,
                        },
                        transaction: t,
                    },
                ),
                ...['list', 'read', 'update', 'close'].map(
                    feature => addAttachments([{ type: 'plan', id: plan.id }])
                        .toUser(planData.government.id)
                        .onFeature(feature, 'plan', t),
                ),
            ]);
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            },
        });
        return next(error);
    }


    let updatedPlan = null;
    try {
        updatedPlan = await planModel.findOne(req.user, req.params.id);
    } catch (error) {
        // ignore
    }

    return res.status(200).send(updatedPlan);
};
