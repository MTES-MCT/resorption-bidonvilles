const sequelize = require('#db/sequelize');
const userModel = require('#server/models/userModel');
const shantytownModel = require('#server/models/shantytownModel');
const { where } = require('#server/utils/permission');
const stringifyWhereClause = require('#server/models/_common/stringifyWhereClause');
const serializePlan = require('./serializePlan');

module.exports = async (user, feature, filters = {}) => {
    const replacements = Object.assign({}, filters);

    const locationClauseGroup = where().can(user).do(feature, 'plan');
    if (locationClauseGroup === null) {
        return [];
    }

    const whereClauseGroups = [];
    if (Object.keys(locationClauseGroup).length > 0) {
        whereClauseGroups.push(locationClauseGroup);
    }

    if (Object.keys(filters).length > 0) {
        whereClauseGroups.push(filters);
    }

    let whereClause = null;
    if (whereClauseGroups.length > 0) {
        whereClause = stringifyWhereClause('plans', whereClauseGroups, replacements);
    }

    const rows = await sequelize.query(
        `SELECT
            plans.plan_id AS id,
            plans.name AS "name",
            plans.started_at AS "startedAt",
            plans.expected_to_end_at AS "expectedToEndAt",
            plans.closed_at AS "closedAt",
            plans.created_at AS "createdAt",
            plans.updated_at AS "updatedAt",
            plans.in_and_out AS "inAndOut",
            plans.goals AS "goals",
            plans.location_type AS "locationType",
            plans.location_details AS "locationDetails",
            plans.final_comment AS "finalComment",
            departements.code AS "departement_code",
            departements.name AS "departement_name",
            regions.code AS "region_code",
            regions.name AS "region_name",
            locations.address AS "location_address",
            (SELECT regexp_matches(locations.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] AS "location_address_simple",
            locations.latitude AS "location_latitude",
            locations.longitude AS "location_longitude",
            plans.created_by AS "createdBy",
            plans.updated_by AS "updatedBy",
            plan_categories.uid AS "planCategoryUid",
            plan_categories.name AS "planCategoryName"
        FROM plans2 AS plans
        LEFT JOIN plan_categories ON plans.fk_category = plan_categories.uid
        LEFT JOIN plan_departements ON plan_departements.fk_plan = plans.plan_id
        LEFT JOIN departements ON plan_departements.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        LEFT JOIN locations ON plans.fk_location = locations.location_id
        ${whereClause !== null ? `WHERE ${whereClause}` : ''}
        ORDER BY plans.plan_id ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    if (rows.length === 0) {
        return [];
    }

    const hashedPlans = rows.reduce((acc, plan) => Object.assign(acc, {
        [plan.id]: plan,
    }), {});

    const planIds = rows.map(({ id }) => id);
    const [planManagers, planOperators, planTopics, planStates, planShantytowns, planFinances] = await Promise.all([
        sequelize.query(
            `SELECT
                fk_plan,
                fk_user
            FROM plan_managers
            WHERE fk_plan IN (:planIds)
            ORDER BY fk_plan ASC`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: Object.assign({}, replacements, {
                    planIds,
                }),
            },
        ),
        sequelize.query(
            'SELECT fk_plan, fk_user FROM plan_operators WHERE fk_plan IN (:planIds) ORDER BY fk_plan ASC',
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    planIds,
                },
            },
        ),
        sequelize.query(
            `SELECT
                plan_topics.fk_plan,
                topics.uid AS topic_uid,
                topics.name AS topic_name
            FROM plan_topics
            LEFT JOIN topics ON plan_topics.fk_topic = topics.uid
            WHERE plan_topics.fk_plan IN (:planIds) ORDER BY plan_topics.fk_plan ASC`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    planIds,
                },
            },
        ),
        sequelize.query(
            `SELECT
                plan_states.plan_state_id,
                plan_states.date,
                plan_states.fk_plan,
                audience_in.total AS in_total,
                audience_in.families AS in_families,
                audience_in.women AS in_women,
                audience_in.minors AS in_minors,
                audience_out_positive.total AS out_positive_total,
                audience_out_positive.families AS out_positive_families,
                audience_out_positive.women AS out_positive_women,
                audience_out_positive.minors AS out_positive_minors,
                audience_out_abandoned.total AS out_abandoned_total,
                audience_out_abandoned.families AS out_abandoned_families,
                audience_out_abandoned.women AS out_abandoned_women,
                audience_out_abandoned.minors AS out_abandoned_minors,
                audience_out_excluded.total AS out_excluded_total,
                audience_out_excluded.families AS out_excluded_families,
                audience_out_excluded.women AS out_excluded_women,
                audience_out_excluded.minors AS out_excluded_minors,
                indicateurs_droit_commun.domiciliation,
                indicateurs_droit_commun.droits_caf,
                indicateurs_droit_commun.emploi_stable,
                indicateurs_sante.ame_valide,
                indicateurs_sante.puma_valide,
                indicateurs_sante.ame_en_cours,
                indicateurs_sante.puma_en_cours,
                indicateurs_sante.orientation,
                indicateurs_sante.accompagnement,
                indicateurs_logement.siao,
                indicateurs_logement.siao_people,
                indicateurs_logement.logement_social,
                indicateurs_logement.logement_social_people,
                indicateurs_logement.dalo,
                indicateurs_logement.dalo_people,
                indicateurs_logement.accompagnes,
                indicateurs_logement.accompagnes_people,
                indicateurs_logement.non_accompagnes,
                indicateurs_logement.non_accompagnes_people,
                indicateurs_logement.heberges,
                indicateurs_logement.heberges_people,
                indicateurs_formation.pole_emploi,
                indicateurs_formation.pole_emploi_femmes,
                indicateurs_formation.mission_locale,
                indicateurs_formation.mission_locale_femmes,
                indicateurs_formation.contrats,
                indicateurs_formation.contrats_femmes,
                indicateurs_formation.formations,
                indicateurs_formation.formations_femmes,
                indicateurs_formation.autoentrepreneurs,
                indicateurs_formation.autoentrepreneurs_femmes,
                indicateurs_formation.are,
                indicateurs_formation.are_femmes,
                indicateurs_education.scolarisables,
                indicateurs_education.en_mediation,
                indicateurs_education.maternelles,
                indicateurs_education.elementaires,
                indicateurs_education.colleges,
                indicateurs_education.lycees,
                indicateurs_education.difficulte_cantine,
                indicateurs_education.difficculte_place_up2a,
                indicateurs_education.difficulte_transport,
                indicateurs_securisation.points_eau,
                indicateurs_securisation.wc,
                indicateurs_securisation.nombre_bennes,
                indicateurs_securisation.electricite
            FROM plan_states
            LEFT JOIN audiences audience_in ON plan_states.fk_audience_in = audience_in.audience_id
            LEFT JOIN audiences audience_out_positive ON plan_states.fk_audience_out_positive = audience_out_positive.audience_id
            LEFT JOIN audiences audience_out_abandoned ON plan_states.fk_audience_out_abandoned = audience_out_abandoned.audience_id
            LEFT JOIN audiences audience_out_excluded ON plan_states.fk_audience_out_excluded = audience_out_excluded.audience_id
            LEFT JOIN indicateurs_droit_commun ON plan_states.fk_indicateurs_commun = indicateurs_droit_commun.indicateurs_droit_commun_id
            LEFT JOIN indicateurs_sante ON plan_states.fk_indicateurs_sante = indicateurs_sante.indicateurs_sante_id
            LEFT JOIN indicateurs_logement ON plan_states.fk_indicateurs_logement = indicateurs_logement.indicateurs_logement_id
            LEFT JOIN indicateurs_formation ON plan_states.fk_indicateurs_formation = indicateurs_formation.indicateurs_formation_id
            LEFT JOIN indicateurs_education ON plan_states.fk_indicateurs_education = indicateurs_education.indicateurs_education_id
            LEFT JOIN indicateurs_securisation ON plan_states.fk_indicateurs_securisation = indicateurs_securisation.indicateurs_securisation_id
            WHERE fk_plan IN (:planIds)
            ORDER BY fk_plan, date ASC`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    planIds,
                },
            },
        ),
        sequelize.query(
            'SELECT fk_plan, fk_shantytown FROM plan_shantytowns WHERE fk_plan IN (:planIds) ORDER BY fk_plan ASC',
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    planIds,
                },
            },
        ),
        sequelize.query(
            `SELECT
                finances.fk_plan,
                finances.finance_id,
                finances.year,
                finances.closed,
                finance_rows.amount,
                finance_rows.real_amount,
                finance_rows.comments,
                finance_types.uid AS finance_type_uid,
                finance_types.name AS finance_type_name
            FROM
                finances
            LEFT JOIN finance_rows ON finance_rows.fk_finance = finances.finance_id
            LEFT JOIN finance_types ON finance_rows.fk_finance_type = finance_types.uid
            WHERE finances.fk_plan IN (:planIds)
            ORDER BY fk_plan ASC, finances.year DESC`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    planIds,
                },
            },
        ),
    ]);

    // users
    const serializedUsers = await userModel.findByIds(
        null,
        [...planManagers, ...planOperators].map(({ fk_user: id }) => id),
    );
    const hashedUsers = serializedUsers.reduce((acc, u) => Object.assign(acc, {
        [u.id]: u,
    }), {});

    planManagers.forEach(({ fk_plan: planId, fk_user: userId }) => {
        if (hashedPlans[planId].managers === undefined) {
            hashedPlans[planId].managers = [];
        }

        hashedPlans[planId].managers.push(hashedUsers[userId]);
    });
    planOperators.forEach(({ fk_plan: planId, fk_user: userId }) => {
        if (hashedPlans[planId].operators === undefined) {
            hashedPlans[planId].operators = [];
        }

        hashedPlans[planId].operators.push(hashedUsers[userId]);
    });

    // topics
    planTopics.forEach(({ fk_plan: planId, topic_uid: uid, topic_name: name }) => {
        if (hashedPlans[planId].topics === undefined) {
            hashedPlans[planId].topics = [];
        }

        hashedPlans[planId].topics.push({
            uid,
            name,
        });
    });

    // plan states
    const planStateIds = planStates.map(({ plan_state_id: id }) => id);
    let serializedEtp = {};
    if (planStateIds.length > 0) {
        const etp = await sequelize.query(
            `SELECT
                plan_state_etp.fk_plan_state,
                plan_state_etp.total,
                etp_types.uid AS etp_type_uid,
                etp_types.name AS etp_type_name
            FROM plan_state_etp
            LEFT JOIN etp_types ON plan_state_etp.fk_etp_type = etp_types.uid
            WHERE plan_state_etp.fk_plan_state IN (:planStateIds)`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    planStateIds,
                },
            },
        );

        serializedEtp = etp.reduce((acc, {
            fk_plan_state, total, etp_type_uid, etp_type_name,
        }) => {
            if (!acc[fk_plan_state]) {
                acc[fk_plan_state] = [];
            }

            acc[fk_plan_state].push({
                type: {
                    uid: etp_type_uid,
                    name: etp_type_name,
                },
                total,
            });
            return acc;
        }, {});
    }

    const parsedPlanStates = planStates.reduce((acc, state) => {
        if (acc[state.fk_plan] === undefined) {
            acc[state.fk_plan] = [];
        }

        acc[state.fk_plan].push({
            id: state.plan_state_id,
            date: new Date(state.date).getTime(),
            etp: serializedEtp[state.plan_state_id] || [],
            audience: {
                in: {
                    total: state.in_total,
                    families: state.in_families,
                    women: state.in_women,
                    minors: state.in_minors,
                },
                out_positive: state.out_positive_total !== null ? {
                    total: state.out_positive_total,
                    families: state.out_positive_families,
                    women: state.out_positive_women,
                    minors: state.out_positive_minors,
                } : null,
                out_abandoned: state.out_abandoned_total !== null ? {
                    total: state.out_abandoned_total,
                    families: state.out_abandoned_families,
                    women: state.out_abandoned_women,
                    minors: state.out_abandoned_minors,
                } : null,
                out_excluded: state.out_excluded_total !== null ? {
                    total: state.out_excluded_total,
                    families: state.out_excluded_families,
                    women: state.out_excluded_women,
                    minors: state.out_excluded_minors,
                } : null,
            },
            droit_commun: {
                domiciliation: state.domiciliation,
                droits_caf: state.droits_caf,
                emploi_stable: state.emploi_stable,
            },
            sante: hashedPlans[state.fk_plan].topics.find(({ uid }) => uid === 'health') ? {
                ame_valide: state.ame_valide,
                puma_valide: state.puma_valide,
                ame_en_cours: state.ame_en_cours,
                puma_en_cours: state.puma_en_cours,
                orientation: state.orientation,
                accompagnement: state.accompagnement,
            } : null,
            logement: hashedPlans[state.fk_plan].topics.find(({ uid }) => uid === 'housing') ? {
                siao: {
                    people: state.siao_people,
                    families: state.siao,
                },
                logement_social: {
                    people: state.logement_social_people,
                    families: state.logement_social,
                },
                dalo: {
                    people: state.dalo_people,
                    families: state.dalo,
                },
                accompagnes: {
                    people: state.accompagnes_people,
                    families: state.accompagnes,
                },
                non_accompagnes: {
                    people: state.non_accompagnes_people,
                    families: state.non_accompagnes,
                },
                heberges: {
                    people: state.heberges_people,
                    families: state.heberges,
                },
            } : null,
            formation: hashedPlans[state.fk_plan].topics.find(({ uid }) => uid === 'work') ? {
                pole_emploi: state.pole_emploi,
                pole_emploi_femmes: state.pole_emploi_femmes,
                mission_locale: state.mission_locale,
                mission_locale_femmes: state.mission_locale_femmes,
                contrats: state.contrats,
                contrats_femmes: state.contrats_femmes,
                formations: state.formations,
                formations_femmes: state.formations_femmes,
                autoentrepreneurs: state.autoentrepreneurs,
                autoentrepreneurs_femmes: state.autoentrepreneurs_femmes,
                are: state.are,
                are_femmes: state.are_femmes,
            } : null,
            education: hashedPlans[state.fk_plan].topics.find(({ uid }) => uid === 'school') ? {
                scolarisables: state.scolarisables,
                en_mediation: state.en_mediation,
                maternelles: state.maternelles,
                elementaires: state.elementaires,
                colleges: state.colleges,
                lycees: state.lycees,
                difficulte_cantine: state.difficulte_cantine,
                difficculte_place_up2a: state.difficculte_place_up2a,
                difficulte_transport: state.difficulte_transport,
            } : null,
            securisation: hashedPlans[state.fk_plan].topics.find(({ uid }) => uid === 'safety') ? {
                points_eau: state.points_eau,
                wc: state.wc,
                nombre_bennes: state.nombre_bennes,
                electricite: state.electricite,
            } : null,
        });

        return acc;
    }, {});
    Object.keys(parsedPlanStates).forEach((planId) => {
        hashedPlans[planId].states = parsedPlanStates[planId];
    });

    // shantytowns
    let hashedShantytowns = {};

    if (planShantytowns.length > 0) {
        const serializedShantytowns = await shantytownModel.findAll(
            user,
            [{ shantytown_id: planShantytowns.map(({ fk_shantytown: id }) => id) }],
        );
        hashedShantytowns = serializedShantytowns.reduce((acc, shantytown) => Object.assign(acc, {
            [shantytown.id]: shantytown,
        }), {});
    }

    planShantytowns
        .filter(({ fk_shantytown: shantytownId }) => hashedShantytowns[shantytownId] !== undefined)
        .forEach(({ fk_plan: planId, fk_shantytown: shantytownId }) => {
            if (hashedPlans[planId].shantytowns === undefined) {
                hashedPlans[planId].shantytowns = [];
            }

            hashedPlans[planId].shantytowns.push(hashedShantytowns[shantytownId]);
        });

    // finances
    planFinances.forEach((finance) => {
        if (hashedPlans[finance.fk_plan].finances === undefined) {
            hashedPlans[finance.fk_plan].finances = [];
        }

        let yearGroup = hashedPlans[finance.fk_plan].finances.find(({ year }) => year === finance.year);
        if (yearGroup === undefined) {
            yearGroup = {
                year: finance.year,
                data: [],
            };
            hashedPlans[finance.fk_plan].finances.push(yearGroup);
        }

        yearGroup.data.push({
            type: {
                uid: finance.finance_type_uid,
                name: finance.finance_type_name,
            },
            amount: finance.amount,
            realAmount: finance.real_amount,
            details: finance.comments,
        });
    });

    return rows.map(serializePlan.bind(this, user));
};
