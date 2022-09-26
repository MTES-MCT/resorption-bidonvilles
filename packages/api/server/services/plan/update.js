const ServiceError = require('#server/errors/ServiceError');
const sequelize = require('#db/sequelize');
const planModel = require('#server/models/planModel');
const financeModel = require('#server/models/financeModel');
const financeRowModel = require('#server/models/financeRowModel');
const financeTypeModel = require('#server/models/financeTypeModel');
const topicModel = require('#server/models/topicModel');
const userModel = require('#server/models/userModel');
const planManagerModel = require('#server/models/planManagerModel');
const { addAttachments, removeAttachments } = require('#server/models/permissionModel');
const planShantytownModel = require('#server/models/planShantytownModel');
const sanitize = require('#server/controllers/planController/_common/sanitize');
const historize = require('#server/controllers/planController/_common/historize');

module.exports = async (data, planId, user) => {
    let plan;
    try {
        plan = await planModel.findOne(user, planId);
    } catch (error) {
        throw new ServiceError('plan_read_error', error);
    }

    // sanitize data
    const planData = Object.assign({}, sanitize(data), {
        updatedBy: user.id,
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

    if (!planData.government || planData.government.length === 0) {
        addError('government', 'Vous devez désigner au moins une personne en charge du pilotage de l\'action');
    } else {
        try {
            const users = await userModel.findByIds(user, planData.government.map(a => a.id));
            if (users.length !== planData.government.length) {
                addError('government', 'Une des personnes désignées comme pilote de l\'action n\'a pas été retrouvée en base de données');
            }
        } catch (error) {
            addError('government', 'Une erreur est survenue lors de la validation du pilote de l\'action');
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

    // update database
    try {
        await sequelize.transaction(async (t) => {
            // save current state into history
            await historize(plan.id, t);

            // update
            await planModel.update({
                ...planData,
                planId: plan.id,
                updatedAt: new Date(),
            }, user.id, t);

            // reset shantytowns, finances and managers
            const promises = [];
            promises.push(planShantytownModel.delete(plan.id, t));
            promises.push(financeModel.delete(plan.id, t));
            if (plan.government_contacts && plan.government_contacts.length > 0) {
                promises.push(planManagerModel.delete(plan.id, t));
                promises.push(...['list', 'read', 'update', 'close'].map(
                    feature => plan.government_contacts.map(manager => removeAttachments([{ type: 'plan', id: plan.id }])
                        .fromUser(manager.id)
                        .onFeature(feature, 'plan', t)),
                ));
            }
            await Promise.all(promises);

            // insert into plan_shantytowns
            if (plan.location_type.id === 'shantytowns') {
                await planShantytownModel.create(plan.id, planData.locationShantytowns, user.id, t);
            }


            if ((planData.finances && planData.finances.length > 0)) {
                // insert into finances
                const financeIds = await Promise.all(
                    planData.finances.map(({ year }) => financeModel.create(plan.id, year, user.id, t)),
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
            }

            // managers
            return Promise.all([
                planManagerModel.create(plan.id, planData.government.map(manager => manager.id), user.id, t),

                ...['list', 'read', 'update', 'close'].map(
                    feature => planData.government.map(manager => addAttachments([{ type: 'plan', id: plan.id }])
                        .toUser(manager.id)
                        .onFeature(feature, 'plan', t)),
                ).flat(),
            ]);
        });
    } catch (error) {
        throw new ServiceError('update_error', error);
    }


    let updatedPlan = null;
    try {
        updatedPlan = await planModel.findOne(user, planId);
    } catch (error) {
        // ignore
    }

    return updatedPlan;
};
