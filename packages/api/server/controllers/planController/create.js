const sequelize = require('#db/sequelize');
const planModel = require('#server/models/planModel')();
const shantytownModel = require('#server/models/shantytownModel');
const departementModel = require('#server/models/departementModel')();
const financeTypeModel = require('#server/models/financeTypeModel')();
const topicModel = require('#server/models/topicModel')();
const userModel = require('#server/models/userModel');
const { addAttachments } = require('#server/models/permissionModel')();
const sanitize = require('./_common/sanitize');

module.exports = async (req, res, next) => {
    // sanitize data
    const planData = Object.assign({}, sanitize(req.body), {
        createdBy: req.user.id,
    });

    // validate data
    const errors = {};
    function addError(field, error) {
        if (errors[field] === undefined) {
            errors[field] = [];
        }

        errors[field].push(error);
    }

    try {
        const departement = await departementModel.findOne(planData.departement);
        if (departement === null) {
            addError('departement', 'Le département d\'intervention est obligatoire');
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            error: {
                developer_message: 'Could not find the matching departement in database',
                user_message: 'Une erreur de lecture en base de données est survenue',
            },
        });
        return next(error);
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
                developer_message: 'Could not fetch the list of finance types from the database',
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
                developer_message: 'Could not fetch the list of topics from the database',
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

    if (typeof planData.inAndOut !== 'boolean') {
        addError('in_and_out', 'Ce champ est obligatoire');
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

    if (!planData.locationType) {
        addError('locationType', 'Le lieu est obligatoire');
    } else if (['shantytowns', 'location', 'housing', 'other'].indexOf(planData.locationType) === -1) {
        addError('locationType', 'Le type de lieu sélectionné n\'est pas reconnu');
    }

    switch (planData.locationType) {
        case 'shantytowns':
            if (planData.locationShantytowns.length === 0) {
                addError('locationShantytowns', 'Vous devez sélectionner au moins un site');
            } else {
                try {
                    const ids = await shantytownModel.findAll(req.user, [
                        {
                            shantytown_id: planData.locationShantytowns,
                        },
                    ]);

                    if (ids.length !== planData.locationShantytowns.length) {
                        addError('locationShantytowns', 'Un ou plusieurs sites sélectionnés n\'ont pas été retrouvés en base de données');
                    }
                } catch (error) {
                    addError('locationShantytowns', 'Une erreur est survenue lors de la validation des sites');
                }
            }
            break;

        case 'location':
            if (!planData.locationAddress) {
                addError('locationAddress', 'L\'adresse du terrain est obligatoire');
            }
            break;

        case 'other':
            if (!planData.locationDetails) {
                addError('locationDetails', 'Vous devez préciser les lieux de déroulement de l\'action');
            }
            break;

        default:
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

    let associationContact;
    if (!planData.associationContact) {
        addError('association', 'Vous devez désigner la personne référente au sein de l\'opérateur ou service en charge de l\'intervention');
    } else {
        try {
            associationContact = await userModel.findOne(planData.associationContact);
            if (associationContact === null) {
                addError('contact', 'La personne référente n\'a pas été retrouvée en base de données');
            } else if (associationContact.organization.category.uid !== 'association') {
                addError('association', 'Le service en charge de l\'intervention doit être une association');
            }
        } catch (error) {
            addError('contact', 'Une erreur est survenue lors de la validation du service en charge de l\'intervention');
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
                developer_message: 'The submitted data contains errors',
                user_message: 'Certaines données sont invalides',
                fields: errors,
            },
        });
    }

    // insert into database
    let finalPlanId;
    try {
        [finalPlanId] = await sequelize.transaction(async (t) => {
            let locationId = null;
            if (planData.locationType === 'location') {
                const response = await sequelize.query(
                    `INSERT INTO locations(
                        address,
                        latitude,
                        longitude,
                        created_by
                    ) VALUES(
                        :address,
                        :latitude,
                        :longitude,
                        :createdBy
                    ) RETURNING location_id AS id`,
                    {
                        replacements: Object.assign({}, planData.locationAddress, {
                            createdBy: req.user.id,
                        }),
                        transaction: t,
                    },
                );

                locationId = response[0][0].id;
            }

            const response = await sequelize.query(
                `INSERT INTO plans2(
                    name,
                    started_at,
                    expected_to_end_at,
                    in_and_out,
                    goals,
                    fk_category,
                    location_type,
                    location_details,
                    fk_location,
                    created_by
                ) VALUES(
                    :name,
                    :startedAt,
                    :expectedToEndAt,
                    :inAndOut,
                    :goals,
                    'autre',
                    :locationType,
                    :locationDetails,
                    :fk_location,
                    :createdBy
                ) RETURNING plan_id AS id`,
                {
                    replacements: Object.assign({}, planData, {
                        fk_location: locationId,
                    }),
                    transaction: t,
                },
            );
            const planId = response[0][0].id;

            await sequelize.query(
                `INSERT INTO plan_departements(fk_plan, fk_departement, created_by)
                VALUES (:planId, :departement, :createdBy)`,
                {
                    replacements: {
                        planId,
                        departement: planData.departement,
                        createdBy: req.user.id,
                    },
                    transaction: t,
                },
            );

            await sequelize.query(
                `INSERT INTO plan_topics(fk_plan, fk_topic, created_by)
                VALUES ${planData.topics.map(() => '(?, ?, ?)').join(', ')}`,
                {
                    replacements: planData.topics.reduce((acc, uid) => [
                        ...acc,
                        planId,
                        uid,
                        req.user.id,
                    ], []),
                    transaction: t,
                },
            );

            if (planData.locationType === 'shantytowns') {
                await sequelize.query(
                    `INSERT INTO plan_shantytowns(fk_plan, fk_shantytown, created_by)
                    VALUES ${planData.locationShantytowns.map(() => '(?, ?, ?)').join(', ')}`,
                    {
                        replacements: planData.locationShantytowns.reduce((acc, id) => [
                            ...acc,
                            planId,
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
                            planId,
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

            return Promise.all([
                Promise.resolve(planId),

                sequelize.query(
                    `INSERT INTO plan_managers(fk_plan, fk_user, created_by)
                    VALUES (:planId, :userId, :createdBy)`,
                    {
                        replacements: {
                            planId,
                            userId: planData.government.id,
                            createdBy: req.user.id,
                        },
                        transaction: t,
                    },
                ),

                sequelize.query(
                    `INSERT INTO plan_operators(fk_plan, fk_user, created_by)
                    VALUES (:planId, :userId, :createdBy)`,
                    {
                        replacements: {
                            planId,
                            userId: planData.associationContact,
                            createdBy: req.user.id,
                        },
                        transaction: t,
                    },
                ),

                // pour le manager (utilisateur), on octroie les droits suivants sur l'action :
                // list, read, update, et close
                ...['list', 'read', 'update', 'close'].map(
                    feature => addAttachments([{ type: 'plan', id: planId }])
                        .toUser(planData.government.id)
                        .onFeature(feature, 'plan', t),
                ),

                // pour l'opérateur (structure), on octroie les droits suivants sur l'action :
                // list, read, updateMarks
                ...['list', 'read', 'updateMarks'].map(
                    feature => addAttachments([{ type: 'plan', id: planId }])
                        .toOrganization(associationContact.organization.id)
                        .onFeature(feature, 'plan', t),
                ),
            ]);
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                developer_message: error,
            },
        });
        return next(error);
    }

    let plan = null;
    try {
        plan = await planModel.findOne(req.user, finalPlanId);
    } catch (error) {
        // ignore
    }

    return res.status(200).send(plan);
};
