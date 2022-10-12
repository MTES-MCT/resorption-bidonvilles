const sequelize = require('#db/sequelize');
const planModel = require('#server/models/planModel');
const etpTypeModel = require('#server/models/etpTypeModel/index');

function sanitizeState(plan, data) {
    const sanitizedData = {};

    // date
    const date = new Date(data.date);
    if (!Number.isNaN(date.getTime())) {
        sanitizedData.date = date;
    }

    // etp
    if (Array.isArray(data.etp)) {
        sanitizedData.etp = data.etp.map(({ total, type }) => ({
            total: parseFloat(total) || 0,
            type,
        }));
    }

    // audience
    const audience = data.audience || {
        in: {
            total: 0, families: 0, women: 0, minors: 0,
        },
        out_positive: {
            total: 0, families: 0, women: 0, minors: 0,
        },
        out_abandoned: {
            total: 0, families: 0, women: 0, minors: 0,
        },
        out_excluded: {
            total: 0, families: 0, women: 0, minors: 0,
        },
    };

    function extractAudience(key) {
        if (!audience[key]) {
            return {
                total: 0,
                families: 0,
                women: 0,
                minors: 0,
            };
        }

        return {
            total: parseInt(audience[key].total, 10),
            families: parseInt(audience[key].families, 10),
            women: parseInt(audience[key].women, 10),
            minors: parseInt(audience[key].minors, 10),
        };
    }

    if (plan.states.length === 0) {
        sanitizedData.audience = {
            in: extractAudience('in'),
            out_positive: null,
            out_abandoned: null,
            out_excluded: null,
        };
    } else {
        sanitizedData.audience = {
            in: extractAudience('in'),
            out_positive: extractAudience('out_positive'),
            out_abandoned: extractAudience('out_abandoned'),
            out_excluded: extractAudience('out_excluded'),
        };
    }

    const topics = plan.topics.map(({ uid }) => uid);

    function getIntOrNull(value) {
        return value !== '' && value !== undefined && value !== null ? parseInt(value, 10) : null;
    }

    // indicateurs droit commun
    sanitizedData.domiciliation = getIntOrNull(data.domiciliation);
    sanitizedData.droits_caf = getIntOrNull(data.droits_caf);
    sanitizedData.emploi_stable = getIntOrNull(data.emploi_stable);

    // indicateurs santé
    if (topics.indexOf('health') !== -1) {
        sanitizedData.ame_valide = getIntOrNull(data.ame_valide);
        sanitizedData.puma_valide = getIntOrNull(data.puma_valide);
        sanitizedData.ame_en_cours = getIntOrNull(data.ame_en_cours);
        sanitizedData.puma_en_cours = getIntOrNull(data.puma_en_cours);
        sanitizedData.orientation = getIntOrNull(data.orientation);
        sanitizedData.accompagnement = getIntOrNull(data.accompagnement);
    }

    // indicateurs logement
    if (topics.indexOf('housing') !== -1) {
        sanitizedData.siao = getIntOrNull(data.siao.families);
        sanitizedData.siao_people = getIntOrNull(data.siao.people);
        sanitizedData.logement_social = getIntOrNull(data.logement_social.families);
        sanitizedData.logement_social_people = getIntOrNull(data.logement_social.people);
        sanitizedData.dalo = getIntOrNull(data.dalo.families);
        sanitizedData.dalo_people = getIntOrNull(data.dalo.people);
        sanitizedData.accompagnes = getIntOrNull(data.accompagnes.families);
        sanitizedData.accompagnes_people = getIntOrNull(data.accompagnes.people);
        sanitizedData.non_accompagnes = getIntOrNull(data.non_accompagnes.families);
        sanitizedData.non_accompagnes_people = getIntOrNull(data.non_accompagnes.people);
        sanitizedData.heberges = getIntOrNull(data.heberges.families);
        sanitizedData.heberges_people = getIntOrNull(data.heberges.people);
    }

    // indicateurs sécurisation
    if (topics.indexOf('safety') !== -1) {
        sanitizedData.points_eau = getIntOrNull(data.points_eau);
        sanitizedData.wc = getIntOrNull(data.wc);
        sanitizedData.nombre_bennes = getIntOrNull(data.nombre_bennes);
        sanitizedData.electricite = getIntOrNull(data.electricite);
    }

    // indicateurs éducation
    if (topics.indexOf('school') !== -1) {
        sanitizedData.scolarisables = getIntOrNull(data.scolarisables);
        sanitizedData.en_mediation = getIntOrNull(data.en_mediation);
        sanitizedData.maternelles = getIntOrNull(data.maternelles);
        sanitizedData.elementaires = getIntOrNull(data.elementaires);
        sanitizedData.colleges = getIntOrNull(data.colleges);
        sanitizedData.lycees = getIntOrNull(data.lycees);
        sanitizedData.difficulte_cantine = data.difficultes && data.difficultes.indexOf('cantine') !== -1;
        sanitizedData.difficulte_place_up2a = data.difficultes && data.difficultes.indexOf('place_up2a') !== -1;
        sanitizedData.difficulte_transport = data.difficultes && data.difficultes.indexOf('transport') !== -1;
    }

    // indicateurs formation
    if (topics.indexOf('work') !== -1) {
        sanitizedData.pole_emploi = getIntOrNull(data.pole_emploi);
        sanitizedData.pole_emploi_femmes = getIntOrNull(data.pole_emploi_femmes);
        sanitizedData.mission_locale = getIntOrNull(data.mission_locale);
        sanitizedData.mission_locale_femmes = getIntOrNull(data.mission_locale_femmes);
        sanitizedData.contrats = getIntOrNull(data.contrats);
        sanitizedData.contrats_femmes = getIntOrNull(data.contrats_femmes);
        sanitizedData.formations = getIntOrNull(data.formations);
        sanitizedData.formations_femmes = getIntOrNull(data.formations_femmes);
        sanitizedData.autoentrepreneurs = getIntOrNull(data.autoentrepreneurs);
        sanitizedData.autoentrepreneurs_femmes = getIntOrNull(data.autoentrepreneurs_femmes);
        sanitizedData.are = getIntOrNull(data.are);
        sanitizedData.are_femmes = getIntOrNull(data.are_femmes);
    }

    return sanitizedData;
}

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
    const stateData = Object.assign({}, sanitizeState(plan, req.body), {
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

    let etpTypes;
    try {
        etpTypes = (await etpTypeModel.findAll()).reduce((acc, type) => Object.assign({}, acc, {
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

    // date
    if (!stateData.date) {
        addError('date', 'La date est obligatoire');
    } else if (plan.states.length > 0 && stateData.date.getTime() <= plan.states.slice(-1)[0].date) {
        // @todo ajouter la date de la dernière saisie ici
        addError('date', 'Vous ne pouvez pas saisir d\'indicateurs pour une date antérieur à la précédente saisie');
    }

    // etp
    if (!stateData.etp || stateData.etp.length === 0) {
        addError('etp', 'Vous devez préciser l\'équipe d\'intervention');
    } else {
        const duplicateEtps = [];
        const usedEtps = [];

        stateData.etp.forEach(({ total, type }, index) => {
            const etpType = etpTypes[type];
            let etpName;
            if (etpType === undefined) {
                addError('etp', `Le type d'ETP de la ligne n°${index + 1} n'est pas reconnu`);
                etpName = `la ligne n°${index + 1}`;
            } else {
                etpName = etpType.name;
            }

            if (total <= 0) {
                addError('etp', `Le nombre d'ETP pour ${etpName} ne peut pas être négatif ou nul`);
            }

            if (usedEtps.indexOf(type) === -1) {
                usedEtps.push(type);
            } else if (duplicateEtps.indexOf(type) === -1) {
                duplicateEtps.push(type);
                addError('etp', `Merci de ne conserver qu'une seule ligne '${etpName}'`);
            }
        });
    }

    // audience
    const hasBadValues = Object.keys(stateData.audience).some((key) => {
        if (stateData.audience[key] === null) {
            return false;
        }

        let returnValue = false;
        returnValue = Object.keys(stateData.audience[key]).some((nestedKey) => {
            if (nestedKey !== 'families') {
                if (Number.isNaN(stateData.audience[key][nestedKey]) || (stateData.audience[key][nestedKey]) < 0) {
                    return true;
                }
            }
            return false;
        });
        return returnValue;
    });

    if (hasBadValues) {
        addError('audience', 'Les chiffres indiqués ne peuvent pas être négatifs');
    }

    if (plan.states.length === 0) {
        if (Number.isNaN(stateData.audience.in.total) || stateData.audience.in.total <= 0) {
            addError('audience', 'Vous devez préciser le nombre de personnes intégrées à l\'action');
        }

        if (Number.isNaN(stateData.audience.in.families)) {
            stateData.audience.in.families = 0;
        }
    }

    if (stateData.audience.in.families > 0) {
        if (stateData.audience.in.total < stateData.audience.in.families) {
            addError('audience', 'Le nombre de ménages ne peut pas être supérieur au nombre de personnes');
        }
    }
    if (stateData.audience.in.women + stateData.audience.in.minors > stateData.audience.in.total) {
        addError('audience', 'La somme du nombre de femmes et de mineurs ne peut pas être supérieure au nombre de personnes');
    }

    // check new audience
    if (plan.states.length > 0) {
        const newAudience = Object.assign({}, plan.audience);

        newAudience.total += stateData.audience.in.total;
        newAudience.families += stateData.audience.in.families;
        newAudience.women += stateData.audience.in.women;
        newAudience.minors += stateData.audience.in.minors;
        ['out_positive', 'out_abandoned', 'out_excluded'].forEach((key) => {
            if (stateData.audience[key]) {
                newAudience.total -= stateData.audience[key].total;
                newAudience.families -= stateData.audience[key].families;
                newAudience.women -= stateData.audience[key].women;
                newAudience.minors -= stateData.audience[key].minors;
            }
        });

        if (newAudience.total < 0) {
            addError('audience', `Selon cette saisie, le nouveau nombre de personnes dans l'action passerait à ${newAudience.total}, ce qui est impossible`);
        }
        if (newAudience.families < 0) {
            addError('audience', `Selon cette saisie, le nouveau nombre de ménages dans l'action passerait à ${newAudience.families}, ce qui est impossible`);
        }
        if (newAudience.women < 0) {
            addError('audience', `Selon cette saisie, le nouveau nombre de femmes dans l'action passerait à ${newAudience.women}, ce qui est impossible`);
        }
        if (newAudience.minors < 0) {
            addError('audience', `Selon cette saisie, le nouveau nombre de mineurs dans l'action passerait à ${newAudience.minors}, ce qui est impossible`);
        }

        if (newAudience.total < newAudience.families) {
            addError('audience', `Selon cette saisie, le nombre de ménages (${newAudience.families}) deviendrait supérieur au nombre de personnes (${newAudience.total})`);
        }
        if (newAudience.women + newAudience.minors > newAudience.total) {
            addError('audience', `Selon cette saisie, la somme du nombre de femmes (${newAudience.women}) et du nombre de mineurs (${newAudience.minors}) deviendrait supérieure au nombre de personnes (${newAudience.total})`);
        }
    }

    // indicateurs droit commun
    const topics = plan.topics.map(({ uid }) => uid);
    if (stateData.domiciliation !== null && (Number.isNaN(stateData.domiciliation) || stateData.domiciliation < 0)) {
        addError('domiciliation', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
    }
    if (stateData.droits_caf !== null && (Number.isNaN(stateData.droits_caf) || stateData.droits_caf < 0)) {
        addError('droits_caf', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
    }
    if (stateData.emploi_stable !== null && (Number.isNaN(stateData.emploi_stable) || stateData.emploi_stable < 0)) {
        addError('emploi_stable', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
    }

    // indicateurs santé
    if (topics.indexOf('health') !== -1) {
        if (stateData.ame_valide !== null && (Number.isNaN(stateData.ame_valide) || stateData.ame_valide < 0)) {
            addError('ame_valide', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.puma_valide !== null && (Number.isNaN(stateData.puma_valide) || stateData.puma_valide < 0)) {
            addError('puma_valide', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.ame_en_cours !== null && (Number.isNaN(stateData.ame_en_cours) || stateData.ame_en_cours < 0)) {
            addError('ame_en_cours', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.puma_en_cours !== null && (Number.isNaN(stateData.puma_en_cours) || stateData.puma_en_cours < 0)) {
            addError('puma_en_cours', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.orientation !== null && (Number.isNaN(stateData.orientation) || stateData.orientation < 0)) {
            addError('orientation', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.accompagnement !== null && (Number.isNaN(stateData.accompagnement) || stateData.accompagnement < 0)) {
            addError('accompagnement', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
    }

    // indicateurs logement
    if (topics.indexOf('housing') !== -1) {
        const inputs = [
            { name: 'siao', label: 'SIAO' },
            { name: 'logement_social', label: 'Logement social' },
            { name: 'dalo', label: 'DALO' },
            { name: 'accompagnes', label: 'Logement accompagné / adapté' },
            { name: 'non_accompagnes', label: 'Logement sans accompagnement' },
            { name: 'heberges', label: 'Hébergement' },
        ];
        inputs.forEach(({ name, label }) => {
            let families = null;
            if (stateData[name] !== null && (Number.isNaN(stateData[name]) || stateData[name] < 0)) {
                addError('housing', `La valeur du champ ${label} (ménages) est invalide : veuillez saisir un nombre supérieur à 0`);
            } else {
                families = stateData[name];
            }

            let people = null;
            if (stateData[`${name}_people`] !== null && (Number.isNaN(stateData[`${name}_people`]) || stateData[`${name}_people`] < 0)) {
                addError('housing', `La valeur du champ ${label} (personnes) est invalide : veuillez saisir un nombre supérieur à 0`);
            } else {
                people = stateData[`${name}_people`];
            }

            if (families !== null && people !== null && families > people) {
                addError('housing', `Le nombre de ménages ne peut pas être supérieur au nombre de personnes pour le champ ${label}`);
            }
        });
    }

    // indicateurs sécurisation
    if (topics.indexOf('safety') !== -1) {
        if (stateData.points_eau !== null && (Number.isNaN(stateData.points_eau) || stateData.points_eau < 0)) {
            addError('points_eau', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.wc !== null && (Number.isNaN(stateData.wc) || stateData.wc < 0)) {
            addError('wc', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.nombre_bennes !== null && (Number.isNaN(stateData.nombre_bennes) || stateData.nombre_bennes < 0)) {
            addError('nombre_bennes', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.electricite !== null && (Number.isNaN(stateData.electricite) || stateData.electricite < 0)) {
            addError('electricite', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
    }

    // indicateurs éducation
    if (topics.indexOf('school') !== -1) {
        if (stateData.scolarisables !== null && (Number.isNaN(stateData.scolarisables) || stateData.scolarisables < 0)) {
            addError('scolarisables', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.en_mediation !== null && (Number.isNaN(stateData.en_mediation) || stateData.en_mediation < 0)) {
            addError('en_mediation', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.maternelles !== null && (Number.isNaN(stateData.maternelles) || stateData.maternelles < 0)) {
            addError('maternelles', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.elementaires !== null && (Number.isNaN(stateData.elementaires) || stateData.elementaires < 0)) {
            addError('elementaires', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.colleges !== null && (Number.isNaN(stateData.colleges) || stateData.colleges < 0)) {
            addError('colleges', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.lycees !== null && (Number.isNaN(stateData.lycees) || stateData.lycees < 0)) {
            addError('lycees', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
    }

    // indicateurs formation
    if (topics.indexOf('work') !== -1) {
        if (stateData.pole_emploi !== null && (Number.isNaN(stateData.pole_emploi) || stateData.pole_emploi < 0)) {
            addError('pole_emploi', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.pole_emploi_femmes !== null && (Number.isNaN(stateData.pole_emploi_femmes) || stateData.pole_emploi_femmes < 0)) {
            addError('pole_emploi_femmes', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.mission_locale !== null && (Number.isNaN(stateData.mission_locale) || stateData.mission_locale < 0)) {
            addError('mission_locale', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.mission_locale_femmes !== null && (Number.isNaN(stateData.mission_locale_femmes) || stateData.mission_locale_femmes < 0)) {
            addError('mission_locale_femmes', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.contrats !== null && (Number.isNaN(stateData.contrats) || stateData.contrats < 0)) {
            addError('contrats', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.contrats_femmes !== null && (Number.isNaN(stateData.contrats_femmes) || stateData.contrats_femmes < 0)) {
            addError('contrats_femmes', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.formations !== null && (Number.isNaN(stateData.formations) || stateData.formations < 0)) {
            addError('formations', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.formations_femmes !== null && (Number.isNaN(stateData.formations_femmes) || stateData.formations_femmes < 0)) {
            addError('formations_femmes', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.autoentrepreneurs !== null && (Number.isNaN(stateData.autoentrepreneurs) || stateData.autoentrepreneurs < 0)) {
            addError('autoentrepreneurs', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.autoentrepreneurs_femmes !== null && (Number.isNaN(stateData.autoentrepreneurs_femmes) || stateData.autoentrepreneurs_femmes < 0)) {
            addError('autoentrepreneurs_femmes', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.are !== null && (Number.isNaN(stateData.are) || stateData.are < 0)) {
            addError('are', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
        if (stateData.are_femmes !== null && (Number.isNaN(stateData.are_femmes) || stateData.are_femmes < 0)) {
            addError('are_femmes', 'Ce champ est obligatoire et sa valeur ne peut pas être négative');
        }
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

    // insert into database
    try {
        await sequelize.transaction(async (t) => {
            const audienceIds = {
                in: null,
                out_positive: null,
                out_abandoned: null,
                out_excluded: null,
            };

            // audience
            const audiencePromises = [];
            if (plan.states.length === 0 || plan.in_and_out === true) {
                audiencePromises.push(sequelize.query(
                    'INSERT INTO audiences(total, families, women, minors) VALUES(:total, :families, :women, :minors) RETURNING audience_id AS id',
                    {
                        replacements: {
                            total: stateData.audience.in.total,
                            families: stateData.audience.in.families,
                            women: stateData.audience.in.women,
                            minors: stateData.audience.in.minors,
                        },
                        transaction: t,
                    },
                ));
            } else {
                audiencePromises.push(Promise.resolve(null));
            }

            if (plan.states.length > 0) {
                audiencePromises.push(sequelize.query(
                    'INSERT INTO audiences(total, families, women, minors) VALUES(:total, :families, :women, :minors) RETURNING audience_id AS id',
                    {
                        replacements: {
                            total: stateData.audience.out_positive.total,
                            families: stateData.audience.out_positive.families,
                            women: stateData.audience.out_positive.women,
                            minors: stateData.audience.out_positive.minors,
                        },
                        transaction: t,
                    },
                ));
                audiencePromises.push(sequelize.query(
                    'INSERT INTO audiences(total, families, women, minors) VALUES(:total, :families, :women, :minors) RETURNING audience_id AS id',
                    {
                        replacements: {
                            total: stateData.audience.out_abandoned.total,
                            families: stateData.audience.out_abandoned.families,
                            women: stateData.audience.out_abandoned.women,
                            minors: stateData.audience.out_abandoned.minors,
                        },
                        transaction: t,
                    },
                ));
                audiencePromises.push(sequelize.query(
                    'INSERT INTO audiences(total, families, women, minors) VALUES(:total, :families, :women, :minors) RETURNING audience_id AS id',
                    {
                        replacements: {
                            total: stateData.audience.out_excluded.total,
                            families: stateData.audience.out_excluded.families,
                            women: stateData.audience.out_excluded.women,
                            minors: stateData.audience.out_excluded.minors,
                        },
                        transaction: t,
                    },
                ));
            } else {
                audiencePromises.push(Promise.resolve(null));
                audiencePromises.push(Promise.resolve(null));
                audiencePromises.push(Promise.resolve(null));
            }

            const [inId, outPositiveId, outAbandonedId, outExcludedId] = await Promise.all(audiencePromises);
            audienceIds.in = inId !== null ? inId[0][0].id : null;
            audienceIds.out_positive = outPositiveId !== null ? outPositiveId[0][0].id : null;
            audienceIds.out_abandoned = outAbandonedId !== null ? outAbandonedId[0][0].id : null;
            audienceIds.out_excluded = outExcludedId !== null ? outExcludedId[0][0].id : null;

            // indicateurs droit commun
            const indicateurPromises = [];
            indicateurPromises.push(
                sequelize.query(
                    `INSERT INTO indicateurs_droit_commun(domiciliation, droits_caf, emploi_stable, created_by)
                    VALUES(:domiciliation, :droits_caf, :emploi_stable, :createdBy)
                    RETURNING indicateurs_droit_commun_id AS id`,
                    {
                        replacements: stateData,
                        transaction: t,
                    },
                ),
            );

            // indicateurs santé
            if (topics.indexOf('health') !== -1) {
                indicateurPromises.push(
                    sequelize.query(
                        `INSERT INTO indicateurs_sante(ame_valide, puma_valide, ame_en_cours, puma_en_cours, orientation, accompagnement, created_by)
                        VALUES(:ame_valide, :puma_valide, :ame_en_cours, :puma_en_cours, :orientation, :accompagnement, :createdBy)
                        RETURNING indicateurs_sante_id AS id`,
                        {
                            replacements: stateData,
                            transaction: t,
                        },
                    ),
                );
            } else {
                indicateurPromises.push(Promise.resolve(null));
            }

            // indicateurs logement
            if (topics.indexOf('housing') !== -1) {
                indicateurPromises.push(
                    sequelize.query(
                        `INSERT INTO indicateurs_logement(siao, siao_people, logement_social, logement_social_people, dalo, dalo_people, accompagnes, accompagnes_people, non_accompagnes, non_accompagnes_people, heberges, heberges_people, created_by)
                        VALUES(:siao, :siao_people, :logement_social, :logement_social_people, :dalo, :dalo_people, :accompagnes, :accompagnes_people, :non_accompagnes, :non_accompagnes_people, :heberges, :heberges_people, :createdBy)
                        RETURNING indicateurs_logement_id AS id`,
                        {
                            replacements: stateData,
                            transaction: t,
                        },
                    ),
                );
            } else {
                indicateurPromises.push(Promise.resolve(null));
            }

            // indicateurs sécurisation
            if (topics.indexOf('safety') !== -1) {
                indicateurPromises.push(
                    sequelize.query(
                        `INSERT INTO indicateurs_securisation(points_eau, wc, nombre_bennes, electricite, created_by)
                        VALUES(:points_eau, :wc, :nombre_bennes, :electricite, :createdBy)
                        RETURNING indicateurs_securisation_id AS id`,
                        {
                            replacements: stateData,
                            transaction: t,
                        },
                    ),
                );
            } else {
                indicateurPromises.push(Promise.resolve(null));
            }

            // indicateurs éducation
            if (topics.indexOf('school') !== -1) {
                indicateurPromises.push(
                    sequelize.query(
                        `INSERT INTO indicateurs_education(scolarisables, en_mediation, maternelles, elementaires, colleges, lycees, difficulte_cantine, difficculte_place_up2a, difficulte_transport, created_by)
                        VALUES(:scolarisables, :en_mediation, :maternelles, :elementaires, :colleges, :lycees, :difficulte_cantine, :difficulte_place_up2a, :difficulte_transport, :createdBy)
                        RETURNING indicateurs_education_id AS id`,
                        {
                            replacements: stateData,
                            transaction: t,
                        },
                    ),
                );
            } else {
                indicateurPromises.push(Promise.resolve(null));
            }

            // indicateurs formation
            if (topics.indexOf('work') !== -1) {
                indicateurPromises.push(
                    sequelize.query(
                        `INSERT INTO indicateurs_formation(pole_emploi, pole_emploi_femmes, mission_locale, mission_locale_femmes, contrats, contrats_femmes, formations, formations_femmes, autoentrepreneurs, autoentrepreneurs_femmes, are, are_femmes, created_by)
                        VALUES(:pole_emploi, :pole_emploi_femmes, :mission_locale, :mission_locale_femmes, :contrats, :contrats_femmes, :formations, :formations_femmes, :autoentrepreneurs, :autoentrepreneurs_femmes, :are, :are_femmes, :createdBy)
                        RETURNING indicateurs_formation_id AS id`,
                        {
                            replacements: stateData,
                            transaction: t,
                        },
                    ),
                );
            } else {
                indicateurPromises.push(Promise.resolve(null));
            }

            const [commun, sante, logement, securisation, education, formation] = await Promise.all(indicateurPromises);
            const indicateurIds = {
                commun: commun[0][0].id,
                sante: sante ? sante[0][0].id : null,
                logement: logement ? logement[0][0].id : null,
                securisation: securisation ? securisation[0][0].id : null,
                education: education ? education[0][0].id : null,
                formation: formation ? formation[0][0].id : null,
            };

            const response = await sequelize.query(
                `INSERT INTO plan_states(
                    date,
                    fk_plan,
                    fk_audience_in,
                    fk_audience_out_positive,
                    fk_audience_out_abandoned,
                    fk_audience_out_excluded,
                    fk_indicateurs_commun,
                    fk_indicateurs_sante,
                    fk_indicateurs_logement,
                    fk_indicateurs_formation,
                    fk_indicateurs_education,
                    fk_indicateurs_securisation,
                    created_by
                ) VALUES(
                    :date,
                    :planId,
                    :in,
                    :out_positive,
                    :out_abandoned,
                    :out_excluded,
                    :commun,
                    :sante,
                    :logement,
                    :formation,
                    :education,
                    :securisation,
                    :createdBy
                ) RETURNING plan_state_id AS id`,
                {
                    replacements: Object.assign(
                        {
                            planId: plan.id,
                        },
                        stateData,
                        audienceIds,
                        indicateurIds,
                    ),
                    transaction: t,
                },
            );
            // stateData.etp
            const planStateId = response[0][0].id;
            return sequelize.query(
                `INSERT INTO plan_state_etp(
                    fk_plan_state,
                    fk_etp_type,
                    total,
                    created_by
                ) VALUES ${stateData.etp.map(() => '(?, ?, ?, ?)').join(', ')}`,
                {
                    replacements: stateData.etp.reduce((acc, { total, type }) => [
                        ...acc,
                        planStateId,
                        type,
                        total,
                        req.user.id,
                    ], []),
                    transaction: t,
                },
            );
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

    // insert into database
    return res.status(200).send({});
};
