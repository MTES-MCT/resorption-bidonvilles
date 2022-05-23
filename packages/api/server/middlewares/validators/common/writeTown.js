/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');
const { isLatLong, trim } = require('validator');
const { can } = require('#server/utils/permission');
// models
const fieldTypeModel = require('#server/models/fieldTypeModel');
const geoModel = require('#server/models/geoModel');
const ownerTypeModel = require('#server/models/ownerTypeModel');
const socialOriginModel = require('#server/models/socialOriginModel');

function fromIntToBoolSanitizer(value) {
    if (value === -1) {
        return null;
    }

    return value === 1;
}

module.exports = mode => ([
    /* **********************************************************************************************
     * Localisation géographique
     ********************************************************************************************* */
    body('address')
        // adresse
        .custom(async (value, { req }) => {
            if (value === undefined || value === null) {
                throw new Error('Le champ "Localisation géographique" est obligatoire');
            }

            if (typeof value !== 'string') {
                throw new Error('Le champ "Localisation géographique" est invalide');
            }

            const trimmed = trim(value);
            if (trimmed === '') {
                throw new Error('Le champ "Localisation géographique" est obligatoire');
            }

            req.body.address = trimmed;
            return true;
        })
        // ville
        .custom(async (value, { req }) => {
            if (req.body.citycode === undefined || req.body.citycode === null) {
                throw new Error('Le code communal est obligatoire');
            }

            if (typeof req.body.citycode !== 'string') {
                throw new Error('Le code communal est invalide');
            }

            let city;
            try {
                city = await geoModel.getLocation('city', req.body.citycode);
            } catch (e) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du code communal');
            }

            if (city === null) {
                throw new Error('Le code communal ne correspond à aucune commune référencée en base de données');
            }

            req.body.city = city;
            return true;
        })
        // permissions d'écriture
        .custom((value, { req }) => {
            if (!req.body.city) {
                return true;
            }

            if (!can(req.user).do(mode, 'shantytown').on(req.body.city)) {
                const wording = mode === 'create' ? 'déclarer' : 'modifier';
                throw new Error(`Vous n'avez pas le droit de ${wording} un site sur ce territoire`);
            }

            return true;
        })
        // coordonnées GPS
        .custom((value, { req }) => {
            if (!req.body.coordinates) {
                throw new Error('Les coordonnées GPS sont obligatoires');
            }

            if (!isLatLong(req.body.coordinates)) {
                throw new Error('Les coordonnées GPS sont invalides');
            }

            const [latitude, longitude] = req.body.coordinates.split(',');
            req.body.latitude = parseFloat(latitude);
            req.body.longitude = parseFloat(longitude);

            return true;
        }),

    /* **********************************************************************************************
     * Appellation du site
     ********************************************************************************************* */
    body('name')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Appellation du site" est invalide')
        .trim()
        .isLength({ max: 35 }).bail().withMessage('Le champ "Appellation du site" ne peut excéder 35 caractères'),

    body('name')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Information d'accès
     ********************************************************************************************* */
    body('detailed_address')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Information d\'accès" est invalide')
        .trim(),

    body('detailed_address')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Date d'installation du site
     ********************************************************************************************* */
    body('built_at')
        .optional({ nullable: true })
        .isDate().bail().withMessage('Le champ "Date d\'installation du site" est invalide')
        .toDate()
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date d\'installation du site ne peut pas être future');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Date de signalement du site
     ********************************************************************************************* */
    body('declared_at')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de signalement du site" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de signalement du site" est invalide')
        .toDate()
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de signalement du site ne peut pas être future');
            }

            if (value < req.body.built_at) {
                throw new Error('La date de signalement du site ne peut pas être antérieure à la date d\'installation');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Type de site
     ********************************************************************************************* */
    body('field_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Type de site" est obligatoire')
        .toInt()
        .isInt().bail().withMessage('Le champ "Type de site" est invalide')
        .custom(async (value, { req }) => {
            let fieldType;
            try {
                fieldType = await fieldTypeModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Type de site"');
            }

            if (fieldType === null) {
                throw new Error('Le type de site sélectionné n\'existe pas en base de données');
            }

            req.body.field_type_full = fieldType;
            return true;
        }),

    /* **********************************************************************************************
     * Type de propriétaire
     ********************************************************************************************* */
    body('owner_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Type de propriétaire" est obligatoire')
        .toInt()
        .isInt().bail().withMessage('Le champ "Type de propriétaire" est invalide')
        .custom(async (value, { req }) => {
            let ownerType;
            try {
                ownerType = await ownerTypeModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Type de propriétaire"');
            }

            if (ownerType === null) {
                throw new Error('Le type de propriétaire sélectionné n\'existe pas en base de données');
            }

            req.body.owner_type_full = ownerType;
            return true;
        }),

    /* **********************************************************************************************
     * Identité du propriétaire
     ********************************************************************************************* */
    body('owner')
        .customSanitizer((value, { req }) => {
            if (!req.user.isAllowedTo('access', 'shantytown_owner')) {
                return null;
            }

            if (!req.body.owner_type_full || req.body.owner_type_full.label === 'Inconnu') {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_owner') && req.body.owner_type_full && req.body.owner_type_full.label !== 'Inconnu')
        .isString().bail().withMessage('Le champ "Identité du propriétaire" est invalide')
        .trim(),

    body('owner')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Reinstallation
     ********************************************************************************************* */
    body('is_reinstallation')
        .exists({ checkNull: true }).bail().withMessage('Le champ "S\'agit-il d\'une réinstallation ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "S\'agit-il d\'une réinstallation ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Précisions sur la réinstallation
     ********************************************************************************************* */
    body('reinstallation_comments')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Précisions sur la réinstallation" est invalide')
        .trim(),

    body('reinstallation_comments')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Statut du diagnostic social
     ********************************************************************************************* */
    body('census_status')
        .optional({ nullable: true })
        .isIn(['none', 'scheduled', 'done']).withMessage('Le champ "Statut du diagnostic social" est invalide'),

    body('census_status')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Date du diagnostic
     ********************************************************************************************* */
    body('census_conducted_at')
        .customSanitizer((value, { req }) => {
            if (!['scheduled', 'done'].includes(req.body.census_status)) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => ['scheduled', 'done'].includes(req.body.census_status))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date du diagnostic" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date du diagnostic" est invalide')
        .toDate()
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date du diagnostic ne peut être antérieure à celle d\'installation du site');
            }

            if (req.body.census_status === 'scheduled') {
                if (value < today) {
                    throw new Error('La date d\'un diagnostic prévu ne peut être passée');
                }
            } else if (value > today) {
                throw new Error('La date d\'un diagnostic réalisé ne peut être future');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Service ou opérateur en charge du diagnostic
     ********************************************************************************************* */
    body('census_conducted_by')
        .customSanitizer((value, { req }) => {
            if (!['scheduled', 'done'].includes(req.body.census_status)) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => ['scheduled', 'done'].includes(req.body.census_status))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Service ou opérateur en charge du diagnostic" est obligatoire')
        .isString().bail().withMessage('Le champ "Service ou opérateur en charge du diagnostic" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Service ou opérateur en charge du diagnostic" est obligatoire'),

    /* **********************************************************************************************
     * Nombre de personnes
     ********************************************************************************************* */
    body('population_total')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes" est invalide')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de personnes" ne peut pas être inférieur à 1'),

    body('population_total')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    /* **********************************************************************************************
     * Nombre de caravanes
     ********************************************************************************************* */
    body('caravans')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de caravanes" est invalide')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de caravanes" ne peut pas être inférieur à 0'),

    body('caravans')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    /* **********************************************************************************************
     * Nombre de cabanes
     ********************************************************************************************* */
    body('huts')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de cabanes" est invalide')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de cabanes" ne peut pas être inférieur à 0'),

    body('huts')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    /* **********************************************************************************************
     * Nombre de ménages
     ********************************************************************************************* */
    body('population_couples')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages" est invalide')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de ménages" ne peut pas être inférieur à 1')
        .custom((value, { req }) => {
            if (!Number.isInteger(req.body.population_total)) {
                return true;
            }

            if (value > req.body.population_total) {
                throw new Error('Le champ "Nombre de ménages" ne peut pas être supérieur au champ "Nombre de personnes"');
            }

            return true;
        }),

    body('population_couples')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    /* **********************************************************************************************
     * Nombre de mineurs
     ********************************************************************************************* */
    // Tranches d'âge
    ...[
        { min: 0, max: 3 },
        { min: 3, max: 6 },
        { min: 6, max: 12 },
        { min: 12, max: 16 },
        { min: 16, max: 18 },
    ]
        .reduce((acc, { min, max }) => [
            ...acc,
            body(`population_minors_${min}_${max}`)
                .optional({ nullable: true })
                .toInt()
                .isInt().bail().withMessage(`Le champ "Nombre de mineurs entre ${min} et ${max} ans" est invalide`)
                .isInt({ min: 0 }).withMessage(`Le champ "Nombre de mineurs entre ${min} et ${max} ans" ne peut pas être inférieur à 0`),

            body(`population_minors_${min}_${max}`)
                .customSanitizer(value => (Number.isInteger(value) ? value : null)),
        ], []),

    // Total
    body('population_minors')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs" est invalide')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.population_total) && value > req.body.population_total) {
                throw new Error('Le champ "Nombre de mineurs" ne peut pas être supérieur au champ "Nombre de personnes"');
            }

            const detailedMinorsTotal = ['0_3', '3_6', '6_12', '12_16', '16_18'].reduce((total, ages) => total + (req.body[`population_minors_${ages}`] || 0), 0);
            if (detailedMinorsTotal > value) {
                throw new Error('La somme du nombre de mineurs par tranche d\'âge est supérieure à la valeur du champ "Nombre de mineurs"');
            }

            return true;
        }),

    body('population_minors')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    /* **********************************************************************************************
     * Nombre d'enfants inscrits dans un établissement scolaire
     ********************************************************************************************* */

    body('minors_in_school')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" est invalide')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.population_total) && value > req.body.population_total) {
                throw new Error('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" ne peut pas être supérieur au champ "Nombre de personnes"');
            }

            if (Number.isInteger(req.body.population_minors) && value > req.body.population_minors) {
                throw new Error('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" ne peut pas être supérieur au champ "Nombre de mineurs"');
            }

            return true;
        }),

    body('minors_in_school')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    /* **********************************************************************************************
     * Origines
     ********************************************************************************************* */
    body('social_origins')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le champ "Origines" est invalide')
        .custom(async (value, { req }) => {
            let socialOrigins = [];
            if (value.length > 0) {
                try {
                    socialOrigins = await socialOriginModel.find(value);
                } catch (error) {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Origines"');
                }

                if (socialOrigins.length !== value.length) {
                    throw new Error('Certaines origines sélectionnées n\'existent pas en base de données');
                }
            }

            req.body.social_origins_full = socialOrigins;
            return true;
        }),

    /* **********************************************************************************************
     * Dépôt de plainte par le propriétaire
     ********************************************************************************************* */
    body('owner_complaint')
        .customSanitizer((value, { req }) => {
            if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_justice'))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Dépôt de plainte par le propriétaire" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Existence d'une procédure judiciaire
     ********************************************************************************************* */
    body('justice_procedure')
        .customSanitizer((value, { req }) => {
            if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_justice'))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Existence d\'une procédure judiciaire" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Existence d\'une procédure judiciaire" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Décision de justice rendue
     ********************************************************************************************* */
    body('justice_rendered')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_procedure !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_procedure === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Décision de justice rendue" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Décision de justice rendue" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Origine de la décision
     ********************************************************************************************* */
    body('justice_rendered_by')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_rendered !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_rendered === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Origine de la décision" est obligatoire')
        .isString().bail().withMessage('Le champ "Origine de la décision" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Origine de la décision" est obligatoire'),

    /* **********************************************************************************************
     * Date de la décision
     ********************************************************************************************* */
    body('justice_rendered_at')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_rendered !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_rendered === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de la décision" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de la décision" est invalide')
        .toDate()
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de la décision ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date de la décision ne peut être antérieure à celle d\'installation');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Contentieux relatif à la décision de justice
     ********************************************************************************************* */
    body('justice_challenged')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_rendered !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_rendered === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Contentieux relatif à la décision de justice" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Contentieux relatif à la décision de justice" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Concours de la force publique
     ********************************************************************************************* */
    body('police_status')
        .optional({ nullable: true })
        .isIn(['none', 'requested', 'granted']).withMessage('Le champ "Concours de la force publique" est invalide'),

    body('police_status')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Date de la demande du CFP
     ********************************************************************************************* */
    body('police_requested_at')
        .customSanitizer((value, { req }) => {
            if (!['requested', 'granted'].includes(req.body.police_status)) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => ['requested', 'granted'].includes(req.body.police_status))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de la demande du CFP" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de la demande du CFP" est invalide')
        .toDate()
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de la demande du CFP ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date de la demande du CFP ne peut être antérieure à celle d\'installation');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Date d'octroi du CFP
     ********************************************************************************************* */
    body('police_granted_at')
        .customSanitizer((value, { req }) => {
            if (req.body.police_status !== 'granted') {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.police_status === 'granted')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date d\'octroi du CFP" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date d\'octroi du CFP" est invalide')
        .toDate()
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date d\'octroi du CFP ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date d\'octroi du CFP ne peut être antérieure à celle d\'installation');
            }

            if (req.body.police_requested_at && value < req.body.police_requested_at) {
                throw new Error('La date d\'octroi du CFP ne peut être antérieur à la date de demande');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Nom de l'étude d'huissiers
     ********************************************************************************************* */
    body('bailiff')
        .optional({ nullable: true })
        .isString().withMessage('Le champ "Nom de l\'étude d\'huissiers" est invalide')
        .trim(),

    body('bailiff')
        .customSanitizer(value => value || null),

    /* *********************************************************************************************
     * Conditions de vie
     ******************************************************************************************** */

    // water
    body('water_access_type')
        .exists().bail().withMessage('Le champ "Les habitants ont-ils accès à l\'eau ?" est obligatoire')
        .custom((value) => {
            if (![
                'fontaine_publique',
                'borne_incendie',
                'achat_bouteille',
                'reservoir',
                'robinet_connecte_au_reseau',
                'autre',
                'inconnu',
            ].includes(value)) {
                throw new Error('Le type d\'accès à l\'eau sélectionné n\'est pas reconnu');
            }

            return true;
        })
        .customSanitizer(value => (value === 'inconnu' ? null : value)),

    body('water_access_type_details')
        .if((value, { req }) => req.body.water_access_type === 'autre')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Veuillez préciser les modalités d\'accès à l\'eau" est obligatoire')
        .isString().bail().withMessage('Le champ "Veuillez préciser les modalités d\'accès à l\'eau" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Veuillez préciser les modalités d\'accès à l\'eau" est obligatoire'),

    body('water_access_type_details')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_type !== 'autre') {
                return null;
            }

            return value;
        }),

    body('water_access_is_public')
        .if((value, { req }) => ['autre', 'robinet_connecte_au_reseau'].includes(req.body.water_access_type))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Est-ce un point d\'eau sur la voie publique ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Est-ce un point d\'eau sur la voie publique ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_public')
        .customSanitizer((value, { req }) => {
            if (!['robinet_connecte_au_reseau', 'autre'].includes(req.body.water_access_type)) {
                return null;
            }

            return value;
        }),

    body('water_access_is_continuous')
        .if((value, { req }) => req.body.water_access_is_public === false)
        .exists({ checkNull: true }).bail().withMessage('Le champ "L\'accès est-il continu ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "L\'accès est-il continu ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_continuous')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_public !== false) {
                return null;
            }

            return value;
        }),

    body('water_access_is_continuous_details')
        .if((value, { req }) => req.body.water_access_is_continuous === false)
        .isString().bail().withMessage('Le champ "Veuillez préciser la discontinuité de l\'accès à l\'eau" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Veuillez préciser la discontinuité de l\'accès à l\'eau" est obligatoire'),

    body('water_access_is_continuous_details')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_continuous !== false) {
                return null;
            }

            return value;
        }),

    body('water_access_is_local')
        .if((value, { req }) => req.body.water_access_is_public === false)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Où se situe l’accès ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Où se situe l’accès ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_local')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_public !== false) {
                return null;
            }

            return value;
        }),

    body('water_access_is_close')
        .if((value, { req }) => req.body.water_access_is_local === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Distance point d’eau / habitation la plus éloignée ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Distance point d’eau / habitation la plus éloignée ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_close')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_local !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_is_unequal')
        .if((value, { req }) => req.body.water_access_is_local === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Des inégalités d\'accès ont-elles été constatées ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Des inégalités d\'accès ont-elles été constatées ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_unequal')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_local !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_is_unequal_details')
        .if((value, { req }) => req.body.water_access_is_unequal === true)
        .isString().bail().withMessage('Le champ "Veuillez préciser l\'inégalité de l\'accès à l\'eau" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Veuillez préciser l\'inégalité de l\'accès à l\'eau" est obligatoire'),

    body('water_access_is_unequal_details')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_unequal !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_has_stagnant_water')
        .if((value, { req }) => req.body.water_access_is_local === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Existe-t-il des eaux stagnantes autour du point de distribution ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Existe-t-il des eaux stagnantes autour du point de distribution ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_has_stagnant_water')
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_local !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_comments')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Informations complémentaires concernant l\'accès à l\'eau" est invalide')
        .trim(),

    body('water_access_comments')
        .customSanitizer(value => value || null),

    // sanitary
    body('sanitary_open_air_defecation')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Constate-t-on des marques de défécation à l’air libre ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Constate-t-on des marques de défécation à l’air libre ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_working_toilets')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Présence de toilettes fonctionnelles et utilisées ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Présence de toilettes fonctionnelles et utilisées ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_toilet_types')
        .if((value, { req }) => req.body.sanitary_working_toilets === true)
        .customSanitizer(value => (value === undefined || value === null ? [] : value))
        .isArray().bail().withMessage('Le champ "Quels sont les types de toilettes installées ?" est invalide')
        .custom((value) => {
            if (value.some(item => !['latrines', 'toilettes_chimiques', 'toilettes_seches', 'toilettes_a_chasse'].includes(item))) {
                throw new Error('Certains types de toilettes sélectionnés ne sont pas reconnus');
            }

            return true;
        }),

    body('sanitary_toilet_types')
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_working_toilets !== true) {
                return [];
            }

            return value;
        }),

    body('sanitary_toilets_are_inside')
        .if((value, { req }) => req.body.sanitary_toilet_types.length > 1 || (req.body.sanitary_toilet_types.length === 1 && !req.body.sanitary_toilet_types.includes('latrines')))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Les toilettes sont-elles à l’intérieur du site ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Les toilettes sont-elles à l’intérieur du site ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_toilets_are_inside')
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_toilet_types.length === 0 || (req.body.sanitary_toilet_types.length === 1 && req.body.sanitary_toilet_types.includes('latrines'))) {
                return null;
            }

            return value;
        }),

    body('sanitary_toilets_are_lighted')
        .if((value, { req }) => req.body.sanitary_toilet_types.length > 1 || (req.body.sanitary_toilet_types.length === 1 && !req.body.sanitary_toilet_types.includes('latrines')))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_toilets_are_lighted')
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_toilet_types.length === 0 || (req.body.sanitary_toilet_types.length === 1 && req.body.sanitary_toilet_types.includes('latrines'))) {
                return null;
            }

            return value;
        }),

    body('sanitary_hand_washing')
        .if((value, { req }) => req.body.sanitary_toilet_types.length > 1 || (req.body.sanitary_toilet_types.length === 1 && !req.body.sanitary_toilet_types.includes('latrines')))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il un point de lavage des mains à proximité des toilettes ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il un point de lavage des mains à proximité des toilettes ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_hand_washing')
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_toilet_types.length === 0 || (req.body.sanitary_toilet_types.length === 1 && req.body.sanitary_toilet_types.includes('latrines'))) {
                return null;
            }

            return value;
        }),

    // electricity
    body('electricity_access')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il présence d’une installation électrique ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il présence d’une installation électrique ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('electricity_access_types')
        .if((value, { req }) => req.body.electricity_access === true)
        .customSanitizer(value => (value === undefined || value === null ? [] : value))
        .isArray().bail().withMessage('Le champ "Quelle est la source de l’accès à l\'électricité ?" est invalide')
        .custom((value) => {
            if (value.some(item => !['electrogene', 'reseau_urbain', 'installation_du_bati'].includes(item))) {
                throw new Error('Certaines sources d\'accès sélectionnées ne sont pas reconnues');
            }

            return true;
        }),

    body('electricity_access_types')
        .customSanitizer((value, { req }) => {
            if (req.body.electricity_access !== true) {
                return [];
            }

            return value;
        }),

    body('electricity_access_is_unequal')
        .if((value, { req }) => req.body.electricity_access_types.length > 0)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Des inégalités d’accès ont-elles été constatées ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Des inégalités d’accès ont-elles été constatées ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('electricity_access_is_unequal')
        .customSanitizer((value, { req }) => {
            if (req.body.electricity_access_types.length === 0) {
                return null;
            }

            return value;
        }),

    // trash
    body('trash_is_piling')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Constate-t-on une accumulation de déchets type ordures ménagères ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Constate-t-on une accumulation de déchets type ordures ménagères ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_close')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il des dispositifs de ramassage des ordures ménagères ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il des dispositifs de ramassage des ordures ménagères ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_safe')
        .if((value, { req }) => req.body.trash_evacuation_is_close === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Les dispositifs de ramassage des ordures ménagères sont-ils en bon état ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Les dispositifs de ramassage des ordures ménagères sont-ils en bon état ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_safe')
        .customSanitizer((value, { req }) => {
            if (req.body.trash_evacuation_is_close !== true) {
                return null;
            }

            return value;
        }),

    body('trash_evacuation_is_regular')
        .if((value, { req }) => req.body.trash_evacuation_is_close === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "La collecte des poubelles est-elle réalisée de manière régulière ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "La collecte des poubelles est-elle réalisée de manière régulière ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_regular')
        .customSanitizer((value, { req }) => {
            if (req.body.trash_evacuation_is_close !== true) {
                return null;
            }

            return value;
        }),

    body('trash_bulky_is_piling')
        .if((value, { req }) => req.body.trash_evacuation_is_close === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Constate-t-on une accumulation de déchets type encombrants ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Constate-t-on une accumulation de déchets type encombrants ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_bulky_is_piling')
        .customSanitizer((value, { req }) => {
            if (req.body.trash_evacuation_is_close !== true) {
                return null;
            }

            return value;
        }),

    // pest animals
    body('pest_animals_presence')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il des nuisibles sur le site ou à proximité ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il des nuisibles sur le site ou à proximité ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('pest_animals_details')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Informations complémentaires concernant la présence de nuisibles" est invalide')
        .trim(),

    body('pest_animals_details')
        .customSanitizer(value => value || null),

    // fire prevention
    body('fire_prevention_diagnostic')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Un diagnostic prévention incendie a-t-il été réalisé ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Un diagnostic prévention incendie a-t-il été réalisé ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

]);
