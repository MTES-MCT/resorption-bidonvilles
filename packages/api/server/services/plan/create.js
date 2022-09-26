const ServiceError = require('#server/errors/ServiceError');
const sequelize = require('#db/sequelize');
const planModel = require('#server/models/planModel');
const shantytownModel = require('#server/models/shantytownModel');
const departementModel = require('#server/models/departementModel');
const financeModel = require('#server/models/financeModel');
const financeTypeModel = require('#server/models/financeTypeModel');
const financeRowModel = require('#server/models/financeRowModel');
const planManagerModel = require('#server/models/planManagerModel');
const topicModel = require('#server/models/topicModel');
const userModel = require('#server/models/userModel');
const permissionModel = require('#server/models/permissionModel');
const sanitize = require('#server/controllers/planController/_common/sanitize');
const locationModel = require('#server/models/locationModel');
const planDepartementModel = require('#server/models/planDepartementModel');
const planTopicsModel = require('#server/models/planTopicsModel');
const planShantytownModel = require('#server/models/planShantytownModel');
const planOperatorModel = require('#server/models/planOperatorModel');

module.exports = async (data, user) => {
    // sanitize data
    const planData = Object.assign({}, sanitize(data), {
        createdBy: user.id,
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
        throw new ServiceError('departement_read_error', error);
    }

    let financeTypes;
    try {
        financeTypes = (await financeTypeModel.findAll()).reduce((acc, type) => Object.assign({}, acc, {
            [type.uid]: type,
        }), {});
    } catch (error) {
        throw new ServiceError('financeType_read_error', error);
    }

    let topics;
    try {
        topics = (await topicModel.findAll()).reduce((acc, topic) => Object.assign({}, acc, {
            [topic.uid]: topic,
        }), {});
    } catch (error) {
        throw new ServiceError('topic_read_error', error);
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
                    const ids = await shantytownModel.findAll(user, [
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

    if (!planData.government || planData.government.length === 0) {
        addError('government', 'Vous devez désigner au moins une personne en charge du pilotage de l\'action');
    } else {
        try {
            const users = await userModel.findByIds(user, planData.government.map(manager => manager.id));
            if (users.length !== planData.government.length) {
                addError('government', 'Une des personnes désignées comme pilote de l\'action n\'a pas été retrouvée en base de données');
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
        planData.finances.forEach(({ year, data: financeData }) => {
            if (year > (new Date()).getFullYear()) {
                addError('finances', `Il est impossible de saisir les financements pour l'année ${year}`);
            } else {
                financeData.forEach(({ amount, type }, index) => {
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
        throw errors;
    }

    // insert into database
    let finalPlanId;
    try {
        [finalPlanId] = await sequelize.transaction(async (t) => {
            let locationId = null;
            if (planData.locationType === 'location') {
                locationId = locationModel.create(Object.assign({}, planData.locationAddress, {
                    createdBy: user.id,
                }), t);
            }

            // insert into plan
            const planId = await planModel.create(Object.assign({}, planData, {
                fk_location: locationId,
            }), t);

            // insert into plan_departement
            await planDepartementModel.create(
                planId,
                planData.departement,
                user.id,
                t,
            );

            // insert into plan_topics
            await planTopicsModel.create(planId, planData.topics, user.id, t);

            // insert into plan_shantytowns
            if (planData.locationType === 'shantytowns') {
                await planShantytownModel.create(planId, planData.locationShantytowns, user.id, t);
            }

            // insert into finances
            const financeIds = await Promise.all(
                planData.finances.map(({ year }) => financeModel.create(planId, year, user.id, t)),
            );

            // insert into finance_rows
            await Promise.all(
                planData.finances.reduce((acc, { data: financeData }, index) => [
                    ...acc,
                    ...financeData.map(({
                        amount, realAmount, type, details,
                    }) => financeRowModel.create(financeIds[index][0][0].id, type, amount, realAmount, details, user.id, t)),
                ], []),
            );

            return Promise.all([
                Promise.resolve(planId),

                planManagerModel.create(planId, planData.government.map(manager => manager.id), user.id, t),
                planOperatorModel.create(planId, planData.associationContact, user.id, t),

                // pour le(s) pilote(s) (utilisateur), on octroie les droits suivants sur l'action :
                // list, read, update, et close
                ...['list', 'read', 'update', 'close'].map(
                    feature => planData.government.map(manager => permissionModel.applyAttachments([{ type: 'plan', id: planId }])
                        .toUser(manager.id)
                        .onFeature(feature, 'plan', t)),
                ),

                // pour l'opérateur (structure), on octroie les droits suivants sur l'action :
                // list, read, updateMarks
                ...['list', 'read', 'updateMarks'].map(
                    feature => permissionModel.applyAttachments([{ type: 'plan', id: planId }])
                        .toOrganization(associationContact.organization.id)
                        .onFeature(feature, 'plan', t),
                ),
            ]);
        });
    } catch (error) {
        throw new ServiceError('insert_error', error);
    }

    let plan = null;
    try {
        plan = await planModel.findOne(user, finalPlanId);
    } catch (error) {
        // ignore
    }

    return plan;
};
