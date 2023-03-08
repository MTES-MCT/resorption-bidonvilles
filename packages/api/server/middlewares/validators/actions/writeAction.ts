/* eslint-disable newline-per-chained-call */
import departementModel from '#server/models/departementModel';
import geoModel from '#server/models/geoModel';
import shantytownModel from '#server/models/shantytownModel';
import topicModel from '#server/models/topicModel';
import userModel from '#server/models/userModel';
import can from '#server/utils/permission/can';
import { body } from 'express-validator';
import validator from 'validator';

const { isLatLong } = validator;

export default (mode: 'create' | 'update') => [
    body('name')
        .isString().bail().withMessage('Le champ "Quel est le nom de l\'action ?" est obligatoire')
        .trim()
        .notEmpty().withMessage('Le nom de l\'action ne peut être vide'),

    body('started_at')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de début" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de début" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        }),

    body('ended_at')
        .optional({ nullable: true })
        .isDate().bail().withMessage('Le champ "Date de fin" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value < req.body.started_at) {
                throw new Error('La date de fin ne peut pas être antérieure à la date de début');
            }

            return true;
        }),
    body('ended_at')
        .customSanitizer(value => value || null),

    body('topics')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Champs d\'intervention" est obligatoire')
        .isArray().bail().withMessage('Le champ "Champs d\'intervention" est invalide')
        .isLength({ min: 1 }).bail().withMessage('Le champ "Champs d\'intervention" est obligatoire')
        .custom(async (value) => {
            let existingTopics = [];
            try {
                existingTopics = await topicModel.findAll();
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Champs d\'intervention"');
            }

            const topics = existingTopics.filter(({ uid }) => value.includes(uid));
            if (topics.length !== value.length) {
                throw new Error('Certains champs d\'intervention sélectionnés n\'existent pas en base de données');
            }

            return true;
        }),

    body('goals')
        .isString().bail().withMessage('Le champ "Objectifs de l\'action" est obligatoire')
        .trim()
        .notEmpty().withMessage('Vous devez préciser les objectifs de l\'action'),

    body('location_departement')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Département d\'intervention principal" est obligatoire')
        .custom(async (value, { req }) => {
            let departement;
            try {
                departement = await departementModel.findOne(value);
            } catch (error) {
                throw new Error('Une lecture en base de données a échoué lors de la validation du champ "Département d\'intervention principal"');
            }

            if (departement === null) {
                throw new Error('Le département sélectionné n\'existe pas en base de données');
            }

            const permission = req.user.permissions?.action?.create;
            if (!permission) {
                throw new Error('Votre compte ne dispose pas des droits suffisants pour déclarer une action');
            }

            if (permission.allow_all === true) {
                return true;
            }

            if (!permission.allowed_on.departements?.includes(departement.code)
                    && !permission.allowed_on.regions?.includes(departement.region)) {
                throw new Error('Votre compte ne dispose pas des droits suffisants pour déclarer une action sur ce département');
            }

            req.body.departement = departement;
            return true;
        }),

    body('location_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Où se déroule l\'action ?" est obligatoire')
        .isIn(['eti', 'logement', 'sur_site', 'autre']).withMessage('Le champ "Où se déroule l\'action ?" est invalide'),

    body('location_eti')
        .if((value, { req }) => req.body.location_type === 'eti')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Adresse de l\'Espace Temporaire d\'Accompagnement" est obligatoire')
        .isString().bail().withMessage('Le champ "Où se déroule l\'action ?" est obligatoire')
        .trim()
        // ville
        .custom(async (value, { req }) => {
            let city;
            try {
                city = await geoModel.getLocation('city', req.body.location_eti_citycode);
            } catch (e) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du code communal');
            }

            if (city === null) {
                throw new Error('Le code communal ne correspond à aucune commune référencée en base de données');
            }

            if (city.departement.code !== req.body.location_departement) {
                throw new Error('L\'adresse de l\'Espace Temporaire d\'Accompagnement doit se situer dans le département d\'intervention principal');
            }

            return true;
        })
        // coordonnées GPS
        .custom((value, { req }) => {
            if (!req.body.location_eti_coordinates) {
                throw new Error('Les coordonnées GPS sont obligatoires');
            }

            if (!isLatLong(req.body.location_eti_coordinates)) {
                throw new Error('Les coordonnées GPS sont invalides');
            }

            const [latitude, longitude] = req.body.location_eti_coordinates.split(',');
            req.body.latitude = parseFloat(latitude);
            req.body.longitude = parseFloat(longitude);

            return true;
        }),

    body('latitude')
        .customSanitizer((value, { req }) => (req.body.location_type === 'eti' ? value : null)),
    body('longitude')
        .customSanitizer((value, { req }) => (req.body.location_type === 'eti' ? value : null)),

    body('location_shantytowns')
        .if((value, { req }) => req.body.location_type === 'sur_site')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Sites concernés" est obligatoire')
        .isArray().bail().withMessage('Le champ "Sites concernés" est invalide')
        .isLength({ min: 1 }).bail().withMessage('Le champ "Sites concernés" est obligatoire')
        .customSanitizer(value => value.map(id => parseInt(id, 10)))
        .custom(async (value, { req }) => {
            let shantytowns = [];
            try {
                shantytowns = await shantytownModel.findAll(req.user, [
                    { shantytown_id: value },
                ]);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la validation des sites');
            }

            if (shantytowns.length !== value.length) {
                throw new Error('Certains des sites sélectionnés comme sites concernés n\'existent pas en base de données');
            }

            return true;
        }),

    body('location_autre')
        .if((value, { req }) => req.body.location_type === 'autre')
        .isString().bail().withMessage('Le champ "¨Préciser le lieu où se déroule l\'action" est obligatoire')
        .trim()
        .notEmpty().withMessage('Vous devez préciser où se déroule l\'action'),
    body('location_autre')
        .customSanitizer(value => value || null),

    body('managers')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Pilotes de l\'action" est obligatoire')
        .isArray().bail().withMessage('Le format des utilisateurs ciblés n\'est pas valide')
        .isLength({ min: 1 }).bail().withMessage('Le champ "Pilotes de l\'action" est obligatoire')
        .customSanitizer(async (value) => {
            const users = await userModel.findByIds(null, value);
            if (users.length !== value.length) {
                return null;
            }

            return users.map(u => ({
                id: u.id,
                organization_id: u.organization.id,
            }));
        })
        .custom((value) => {
            if (value === null) {
                throw new Error('Un ou plusieurs utilisateurs ciblés n\'existent pas');
            }

            return true;
        }),

    body('operators')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Opérateurs de l\'action" est obligatoire')
        .isArray().bail().withMessage('Le format des utilisateurs ciblés n\'est pas valide')
        .isLength({ min: 1 }).bail().withMessage('Le champ "Opérateurs de l\'action" est obligatoire')
        .customSanitizer(async (value) => {
            const users = await userModel.findByIds(null, value);
            if (users.length !== value.length) {
                return null;
            }

            return users.map(u => ({
                id: u.id,
                organization_id: u.organization.id,
            }));
        })
        .custom((value) => {
            if (value === null) {
                throw new Error('Un ou plusieurs utilisateurs ciblés n\'existent pas');
            }

            return true;
        }),

    // financements
    // transformer finances en un array pour faciliter la validation plus bas
    body('finances')
        .customSanitizer((value, { req }) => {
            if (mode === 'create') {
                if (!req.body.departement || !can(req.user).do('access', 'action_finances').on(req.body.departement)) {
                    return [];
                }
            } else if (!req.action || !can(req.user).do('access', 'action_finances').on(req.action)) {
                return [];
            }

            return Object.keys(value).map(year => ({
                year,
                rows: value[year],
            }));
        }),

    body('finances.*.finance_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Type de financement" est obligatoire')
        .isIn(['etatique', 'dedie', 'collectivite', 'europeen', 'prive', 'autre'])
        .bail().withMessage('Le type de financement est invalide'),

    body('finances.*.amount')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Montant" est obligatoire')
        .toFloat()
        .isFloat().bail().withMessage('Le champ "Montant" doit être un nombre')
        .isFloat({ min: 0 }).bail().withMessage('Le champ "Montant" doit être supérieur ou égal à 0'),

    body('finances.*.real_amount')
        .customSanitizer(value => value || 0.0)
        .toFloat()
        .isFloat().bail().withMessage('Le champ "Dépenses exécutées" doit être un nombre')
        .isFloat({ min: 0 }).bail().withMessage('Le champ "Dépenses exécutées" doit être supérieur ou égal à 0'),

    body('finances.*.comments')
        .customSanitizer(value => value || '')
        .isString().bail().withMessage('Le champ "Commentaires" doit être une chaîne de caractères')
        .isLength({ max: 255 }).bail().withMessage('Le champ "Commentaires" ne doit pas dépasser 255 caractères')
        .trim(),

    // re-transformer finances dans son format initial
    body('finances')
        .customSanitizer(value => value.reduce((acc, yearFinance) => {
            acc[yearFinance.year] = yearFinance.rows;
            return acc;
        }, {}))
        .custom((value, { req }) => {
            Object.keys(value).forEach((strYear) => {
                const year = parseInt(strYear, 10);

                if (req.body.started_at?.getFullYear && year < req.body.started_at.getFullYear()) {
                    throw new Error('Vous ne pouvez pas renseigner les financements pour une année précédant l\'année de début de l\'action');
                }

                if (req.body.ended_at?.getFullYear && year > req.body.ended_at.getFullYear()) {
                    throw new Error('Vous ne pouvez pas renseigner les financements pour une année ultérieure à l\'année de fin de l\'action');
                }
            });

            return true;
        }),

    // indicateurs communs
    body('date_indicateurs')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de mise à jour" est obligatoire')
        .toDate()
        .customSanitizer((value) => {
            const today = new Date();

            if (value > today) {
                return today;
            }

            return value;
        }),

    body('nombre_personnes')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes" doit être un nombre')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de personnes" ne peut pas être inférieur à 1'),
    body('nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('nombre_menages')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages" doit être un nombre')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de ménages" ne peut pas être inférieur à 1')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de ménages ne peut être supérieur au nombre de personnes');
            }

            return true;
        }),
    body('nombre_menages')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('nombre_femmes')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de femmes" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de femmes" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de femmes ne peut être supérieur au nombre de personnes');
            }

            return true;
        }),
    body('nombre_femmes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('nombre_mineurs')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de mineurs ne peut être supérieur au nombre de personnes');
            }

            return true;
        }),
    body('nombre_mineurs')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    // indicateurs santé
    body('sante_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('health'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu un accompagnement vers la santé" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu un accompagnement vers la santé" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu un accompagnement vers la santé ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('sante_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),


    // indicateurs travail
    body('travail_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('work'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu au moins 1 contrat de travail" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu au moins 1 contrat de travail" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('travail_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('travail_nombre_femmes')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('work'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de femmes ayant eu au moins 1 contrat de travail" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de femmes ayant eu au moins 1 contrat de travail" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.travail_nombre_personnes)) {
                if (value > req.body.travail_nombre_personnes) {
                    throw new Error('Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de personnes');
                }
            } else if (Number.isInteger(req.body.nombre_femmes)) {
                if (value > req.body.nombre_femmes) {
                    throw new Error('Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de femmes concernées par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('travail_nombre_femmes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),


    // indicateurs hébergement
    body('hebergement_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu accès à un hébergement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu accès à un hébergement" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('hebergement_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('hebergement_nombre_menages')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages ayant eu accès à un hébergement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de ménages ayant eu accès à un hébergement" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.hebergement_nombre_personnes)) {
                if (value > req.body.hebergement_nombre_personnes) {
                    throw new Error('Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes');
                }
            } else if (Number.isInteger(req.body.nombre_menages)) {
                if (value > req.body.nombre_menages) {
                    throw new Error('Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de ménages concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('hebergement_nombre_menages')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('logement_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu accès à un logement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu accès à un logement" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu accès à un logement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('logement_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('logement_nombre_menages')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages ayant eu accès à un logement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de ménages ayant eu accès à un logement" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.logement_nombre_personnes)) {
                if (value > req.body.logement_nombre_personnes) {
                    throw new Error('Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de personnes');
                }
            } else if (Number.isInteger(req.body.nombre_menages)) {
                if (value > req.body.nombre_menages) {
                    throw new Error('Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de ménages concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('logement_nombre_menages')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),


    // indicateurs scolaires
    body('scolaire_mineurs_scolarisables')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs en âge d\'être scolarisés" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs en âge d\'être scolarisés" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_mineurs)) {
                if (value > req.body.nombre_mineurs) {
                    throw new Error('Le nombre de mineurs en âge d\'être scolarisés ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de mineurs en âge d\'être scolarisés ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('scolaire_mineurs_scolarisables')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('scolaire_mineurs_en_mediation')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs bénéficiant d\'une médiation" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs bénéficiant d\'une médiation" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_mineurs)) {
                if (value > req.body.nombre_mineurs) {
                    throw new Error('Le nombre de mineurs bénéficiant d\'une médiation ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de mineurs bénéficiant d\'une médiation ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('scolaire_mineurs_en_mediation')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('scolaire_nombre_maternelle')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés en maternelle" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés en maternelle" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_mineurs)) {
                if (value > req.body.nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés en maternelle ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de scolarisés en maternelle ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('scolaire_nombre_maternelle')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('scolaire_nombre_elementaire')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés en élémentaire" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés en élémentaire" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_mineurs)) {
                if (value > req.body.nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés en élémentaire ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de scolarisés en élémentaire ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('scolaire_nombre_elementaire')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('scolaire_nombre_college')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés au collège" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés au collège" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_mineurs)) {
                if (value > req.body.nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés au collège ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de scolarisés au collège ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('scolaire_nombre_college')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('scolaire_nombre_lycee')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés au lycée" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés au lycée" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_mineurs)) {
                if (value > req.body.nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés au lycée ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre de scolarisés au lycée ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('scolaire_nombre_lycee')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('scolaire_nombre_autre')
        .if((value, { req }) => req.body.topics?.includes && req.body.topics.includes('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Autre" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Autre" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.nombre_mineurs)) {
                if (value > req.body.nombre_mineurs) {
                    throw new Error('Le nombre d\'autres scolarisations ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.nombre_personnes) && value > req.body.nombre_personnes) {
                throw new Error('Le nombre d\'autres scolarisations ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('scolaire_nombre_autre')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),
];
