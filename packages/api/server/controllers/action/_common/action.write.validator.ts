/* eslint-disable newline-per-chained-call */
import geoModel from '#server/models/geoModel';
import { Location } from '#server/models/geoModel/Location.d';
import shantytownModel from '#server/models/shantytownModel';
import topicModel from '#server/models/topicModel';
import userModel from '#server/models/userModel';
import can from '#server/utils/permission/can';
import hasMetricValues from '#server/services/action/_common/hasMetricValues';
import { body } from 'express-validator';
import validator from 'validator';

const { isLatLong } = validator;

function canWriteFinances(mode: 'create' | 'update', req): boolean {
    if (mode === 'create') {
        if (req.body.location && can(req.user).do('access', 'action_finances').on(req.body.location)) {
            return true;
        }

        return req.body.managers.some(({ organization_id }) => req.user.organization.id === organization_id);
    }

    return req.action && can(req.user).do('access', 'action_finances').on(req.action);
}

function canWriteManagersAndDepartement(mode: 'create' | 'update', req) {
    if (mode === 'create') {
        return true;
    }

    return canWriteFinances(mode, req);
}

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
        .customSanitizer(value => value ?? null),

    body('topics')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Champs d\'intervention" est obligatoire')
        .isArray().bail().withMessage('Le champ "Champs d\'intervention" est invalide')
        .isLength({ min: 1 }).bail().withMessage('Le champ "Champs d\'intervention" est obligatoire')
        .custom(async (value) => {
            let existingTopics = [];
            try {
                existingTopics = await topicModel.findAll();
            } catch {
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
        .customSanitizer((value, { req }) => {
            // en cas de mise à jour, si l'utilisateur n'a pas le droit de modifier le département
            // on conserve le département actuel
            if (mode === 'update' && !canWriteManagersAndDepartement(mode, req)) {
                return req.action.location.departement.code;
            }

            return value;
        })
        .exists({ checkNull: true }).bail().withMessage('Le champ "Département d\'intervention principal" est obligatoire')
        .custom(async (value, { req }) => {
            let location: Location;
            try {
                location = await geoModel.getLocation('departement', value);
            } catch {
                throw new Error('Une lecture en base de données a échoué lors de la validation du champ "Département d\'intervention principal"');
            }

            if (location === null) {
                throw new Error('Le département sélectionné n\'existe pas en base de données');
            }

            req.body.location = location;

            // si le département n'a pas changé, on ne vérifie pas les permissions
            // un cas possible est celui d'un utilisateur désigné pilote ou opérateur d'une action
            // sur un territoire sur lequel il n'a pas les droits de déclaration d'une action
            // son statut de pilote ou opérateur devrait lui autoriser à modifier l'action mais il
            // serait confronté à une erreur si on vérifiait les permissions ici
            // les seuls cas à vérifier sont donc : en cas de création d'une action ou de modification
            // de son territoire
            if (req.action?.location?.departement?.code === value) {
                return true;
            }

            if (!can(req.user).do('create', 'action').on(location)) {
                throw new Error('Votre compte ne dispose pas des droits suffisants pour déclarer une action sur ce département');
            }

            return true;
        }),

    body('location_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Où se déroule l\'action ?" est obligatoire')
        .isIn(['eti', 'logement', 'sur_site', 'autre']).withMessage('Le champ "Où se déroule l\'action ?" est invalide'),

    body('location_eti_addresses')
        .if((value, { req }) => req.body.location_type === 'eti')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Adresses des Espaces Temporaires d\'Accompagnement" est obligatoire')
        .isArray().bail().withMessage('Le format du champ "Adresses des Espaces Temporaires d\'Accompagnement" n\'est pas correct')
        .isLength({ min: 1 }).bail().withMessage('Au moins une adresse est requise pour un Espace Temporaire d\'Accompagnement')
        .custom(async (addresses, { req }) => {
            // Valider la structure de chaque adresse et parser les coordonnées
            const parsedAddresses = addresses.map((address, i) => {
                // Vérifier que l'adresse est un objet
                if (!address || typeof address !== 'object') {
                    throw new Error(`L'adresse ${i + 1} est invalide`);
                }

                // Vérifier l'adresse textuelle
                if (!address.address || typeof address.address !== 'string' || address.address.trim() === '') {
                    throw new Error(`L'adresse ${i + 1} : le champ adresse est obligatoire`);
                }

                // Vérifier le code commune
                if (!address.citycode || typeof address.citycode !== 'string') {
                    throw new Error(`L'adresse ${i + 1} : le code commune est obligatoire`);
                }

                // Vérifier les coordonnées GPS
                if (!address.coordinates || typeof address.coordinates !== 'string') {
                    throw new Error(`L'adresse ${i + 1} : les coordonnées GPS sont obligatoires`);
                }

                if (!isLatLong(address.coordinates)) {
                    throw new Error(`L'adresse ${i + 1} : les coordonnées GPS sont invalides`);
                }

                // Parser les coordonnées
                const [latitude, longitude] = address.coordinates.split(',');
                return {
                    ...address,
                    latitude: Number.parseFloat(latitude),
                    longitude: Number.parseFloat(longitude),
                };
            });

            // Valider toutes les villes en parallèle
            try {
                const cities = await Promise.all(
                    parsedAddresses.map(address => geoModel.getLocation('city', address.citycode)),
                );

                cities.forEach((city, i) => {
                    if (city === null) {
                        throw new Error(`L'adresse ${i + 1} : le code communal ne correspond à aucune commune référencée en base de données`);
                    }

                    if (city.departement.code !== req.body.location_departement) {
                        throw new Error(`L'adresse ${i + 1} : l'adresse doit se situer dans le département d'intervention principal`);
                    }
                });
            } catch (e) {
                if (e.message.startsWith('L\'adresse')) {
                    throw e;
                }
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation des codes communaux');
            }

            // Stocker les adresses parsées pour le sanitizer
            req.body.parsedAddresses = parsedAddresses;

            // Valider l'absence de doublons dans le formulaire
            const addressKeys = new Set();
            parsedAddresses.forEach((address, i) => {
                // Normaliser l'adresse pour gérer les apostrophes typographiques
                const normalizedAddress = String(address.address || '')
                    .normalize('NFD')
                    .replaceAll(/[\u0300-\u036f]/g, '')
                    .replaceAll(/['''\u2019]/g, "'")
                    .toLowerCase()
                    .trim();
                const addressKey = `${normalizedAddress}|${String(address.citycode || '')}|${String(address.latitude || '')}|${String(address.longitude || '')}`;
                if (addressKeys.has(addressKey)) {
                    throw new Error(`L'adresse ${i + 1} est un doublon d'une adresse déjà saisie`);
                }
                addressKeys.add(addressKey);
            });

            return true;
        })
        .customSanitizer((addresses, { req }) => {
            if (!addresses) {
                return null;
            }
            // Utiliser les adresses déjà parsées et validées
            const parsedAddresses = req.body.parsedAddresses || addresses;
            delete req.body.parsedAddresses;

            // Transformer en format attendu par le modèle
            return parsedAddresses.map(addr => ({
                address: addr.address.trim(),
                latitude: addr.latitude,
                longitude: addr.longitude,
                citycode: addr.citycode,
            }));
        }),

    body('location_eti_addresses')
        .customSanitizer((value, { req }) => (req.body.location_type === 'eti' ? value : null)),

    body('location_shantytowns')
        .if((value, { req }) => req.body.location_type === 'sur_site')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Sites concernés" est obligatoire')
        .isArray().bail().withMessage('Le champ "Sites concernés" est invalide')
        .isLength({ min: 1 }).bail().withMessage('Le champ "Sites concernés" est obligatoire')
        .customSanitizer(value => value.map(id => Number.parseInt(id, 10)))
        .custom(async (value, { req }) => {
            let shantytowns = [];
            try {
                shantytowns = await shantytownModel.findAll(req.user, [
                    { shantytown_id: { value } },
                ]);
            } catch {
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
        .customSanitizer((value, { req }) => {
            // Force NULL pour les types 'sur_site', 'logement' et 'eti' (contrainte DB)
            if (req.body.location_type === 'sur_site' || req.body.location_type === 'logement' || req.body.location_type === 'eti') {
                return null;
            }
            // Convertit les chaînes vides, null ou undefined en null pour les autres types
            if (value === '' || value === null || value === undefined) {
                return null;
            }
            return value;
        }),
    body('managers')
        .customSanitizer((value, { req }) => {
            // en cas de mise à jour, si l'utilisateur n'a pas le droit de modifier les managers
            // on conserve les managers actuels
            if (mode === 'update' && !canWriteManagersAndDepartement(mode, req)) {
                return req.action.managers.flatMap(({ users }) => users.map(({ id }) => id));
            }

            return value;
        })
        .exists({ checkNull: true }).bail().withMessage('Le champ "Pilotes de l\'action" est obligatoire')
        .isArray().bail().withMessage('Le format des utilisateurs ciblés n\'est pas valide')
        .isLength({ min: 1 }).bail().withMessage('Le champ "Pilotes de l\'action" est obligatoire')
        .customSanitizer(async (value) => {
            const filteredValue = value.filter(id => id !== undefined && id !== null);
            if (filteredValue.length === 0) {
                return null;
            }

            const users = await userModel.findByIds(null, filteredValue);
            if (users.length !== filteredValue.length) {
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
            const filteredValue = value.filter(id => id !== undefined && id !== null);
            if (filteredValue.length === 0) {
                return null;
            }

            const users = await userModel.findByIds(null, filteredValue);
            if (users.length !== filteredValue.length) {
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
            if (!canWriteFinances(mode, req)) {
                // en cas de mise à jour, si l'utilisateur n'a pas le droit de modifier les financements
                // on conserve les financements existants
                if (mode === 'update') {
                    return Object.keys(req.action.finances)
                        .map(year => ({
                            year,
                            rows: req.action.finances[year].map(row => ({
                                finance_type: row.type.uid,
                                amount: row.amount,
                                real_amount: row.real_amount,
                                comments: row.comments,
                            })),
                        }));
                }

                return [];
            }

            if (!value) {
                return [];
            }

            return Object.keys(value)
                .map(year => ({
                    year,
                    rows: value[year],
                }))
                .filter(finance => finance.rows.length > 0);
        }),

    body('finances.*.rows.*.finance_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Type de financement" est obligatoire')
        .isIn(['etatique', 'dedie', 'collectivite', 'europeen', 'prive', 'autre'])
        .bail().withMessage('Le type de financement est invalide'),

    body('finances.*.rows.*.amount')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Montant" est obligatoire')
        .customSanitizer(value => (typeof value === 'string' ? value.replace(',', '.') : value))
        .toFloat()
        .isFloat().bail().withMessage('Le champ "Montant" doit être un nombre')
        .isFloat({ min: 0 }).bail().withMessage('Le champ "Montant" doit être supérieur ou égal à 0'),

    body('finances.*.rows.*.real_amount')
        .optional({ nullable: true, checkFalsy: true })
        .customSanitizer(value => (typeof value === 'string' ? value.replace(',', '.') : value))
        .toFloat()
        .isFloat().bail().withMessage('Le champ "Dépenses exécutées" doit être un nombre')
        .isFloat({ min: 0 }).bail().withMessage('Le champ "Dépenses exécutées" doit être supérieur ou égal à 0'),

    body('finances.*.rows.*.real_amount')
        .customSanitizer(value => (typeof value === 'number' ? value : null)),

    body('finances.*.rows.*.comments')
        .customSanitizer(value => value ?? '')
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
                const year = Number.parseInt(strYear, 10);

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
    body('indicateurs')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Indicateurs" est obligatoire')
        .custom((value, { req }) => {
            const years = Object.keys(value);

            let minYear = null;
            if (req.body.started_at?.getFullYear) {
                minYear = req.body.started_at.getFullYear();
            }

            let maxYear = null;
            if (req.body.ended_at?.getFullYear) {
                maxYear = req.body.ended_at.getFullYear();
            }

            years.forEach((strYear) => {
                if (!hasMetricValues(value[strYear])) {
                    return;
                }

                const year = Number.parseInt(strYear, 10);
                if ((minYear && year < minYear) || (maxYear && year > maxYear)) {
                    throw new Error(`Indicateurs - L'année ${year} n'est pas comprise dans la période d'exécution de l'action`);
                }
            });

            return true;
        }),

    body('indicateurs.*.nombre_personnes')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes" doit être un nombre')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de personnes" ne peut pas être inférieur à 1'),
    body('indicateurs.*.nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.nombre_menages')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages" doit être un nombre')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de ménages" ne peut pas être inférieur à 1')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de ménages ne peut être supérieur au nombre de personnes');
            }

            return true;
        }),
    body('indicateurs.*.nombre_menages')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.nombre_femmes')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de femmes" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de femmes" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de femmes ne peut être supérieur au nombre de personnes');
            }

            return true;
        }),
    body('indicateurs.*.nombre_femmes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.nombre_mineurs')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de mineurs ne peut être supérieur au nombre de personnes');
            }

            return true;
        }),
    body('indicateurs.*.nombre_mineurs')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    // indicateurs santé
    body('indicateurs.*.sante_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes?.('health'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu un accompagnement vers la santé" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu un accompagnement vers la santé" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu un accompagnement vers la santé ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.sante_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),


    // indicateurs travail
    body('indicateurs.*.travail_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes?.('work'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu au moins 1 contrat de travail" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu au moins 1 contrat de travail" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.travail_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.travail_nombre_femmes')
        .if((value, { req }) => req.body.topics?.includes?.('work'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de femmes ayant eu au moins 1 contrat de travail" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de femmes ayant eu au moins 1 contrat de travail" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].travail_nombre_personnes)) {
                if (value > req.body.indicateurs[key].travail_nombre_personnes) {
                    throw new Error('Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de personnes');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_femmes)) {
                if (value > req.body.indicateurs[key].nombre_femmes) {
                    throw new Error('Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de femmes concernées par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.travail_nombre_femmes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),


    // indicateurs hébergement
    body('indicateurs.*.hebergement_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes?.('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu accès à un hébergement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu accès à un hébergement" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.hebergement_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.hebergement_nombre_menages')
        .if((value, { req }) => req.body.topics?.includes?.('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages ayant eu accès à un hébergement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de ménages ayant eu accès à un hébergement" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].hebergement_nombre_personnes)) {
                if (value > req.body.indicateurs[key].hebergement_nombre_personnes) {
                    throw new Error('Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_menages)) {
                if (value > req.body.indicateurs[key].nombre_menages) {
                    throw new Error('Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de ménages concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.hebergement_nombre_menages')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.logement_nombre_personnes')
        .if((value, { req }) => req.body.topics?.includes?.('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes ayant eu accès à un logement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de personnes ayant eu accès à un logement" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de personnes ayant eu accès à un logement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.logement_nombre_personnes')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.logement_nombre_menages')
        .if((value, { req }) => req.body.topics?.includes?.('housing'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages ayant eu accès à un logement" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de ménages ayant eu accès à un logement" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].logement_nombre_personnes)) {
                if (value > req.body.indicateurs[key].logement_nombre_personnes) {
                    throw new Error('Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de personnes');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_menages)) {
                if (value > req.body.indicateurs[key].nombre_menages) {
                    throw new Error('Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de ménages concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.logement_nombre_menages')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),


    // indicateurs scolaires
    body('indicateurs.*.scolaire_mineurs_scolarisables')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs identifiés sur site" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs identifiés sur site" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_mineurs)) {
                if (value > req.body.indicateurs[key].nombre_mineurs) {
                    throw new Error('Le nombre de mineurs identifiés sur site ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de mineurs identifiés sur site ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.scolaire_mineurs_scolarisables')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.scolaire_mineurs_en_mediation')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs bénéficiant d\'une médiation" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs bénéficiant d\'une médiation" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_mineurs)) {
                if (value > req.body.indicateurs[key].nombre_mineurs) {
                    throw new Error('Le nombre de mineurs bénéficiant d\'une médiation ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de mineurs bénéficiant d\'une médiation ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.scolaire_mineurs_en_mediation')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.scolaire_nombre_maternelle')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés en maternelle" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés en maternelle" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_mineurs)) {
                if (value > req.body.indicateurs[key].nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés en maternelle ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de scolarisés en maternelle ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.scolaire_nombre_maternelle')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.scolaire_nombre_elementaire')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés en élémentaire" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés en élémentaire" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_mineurs)) {
                if (value > req.body.indicateurs[key].nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés en élémentaire ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de scolarisés en élémentaire ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.scolaire_nombre_elementaire')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.scolaire_nombre_college')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés au collège" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés au collège" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_mineurs)) {
                if (value > req.body.indicateurs[key].nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés au collège ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de scolarisés au collège ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.scolaire_nombre_college')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.scolaire_nombre_lycee')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de scolarisés au lycée" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de scolarisés au lycée" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_mineurs)) {
                if (value > req.body.indicateurs[key].nombre_mineurs) {
                    throw new Error('Le nombre de scolarisés au lycée ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre de scolarisés au lycée ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.scolaire_nombre_lycee')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('indicateurs.*.scolaire_nombre_autre')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Autre" doit être un nombre')
        .isInt({ min: 0 }).withMessage('Le champ "Autre" ne peut pas être inférieur à 0')
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            if (Number.isInteger(req.body.indicateurs[key].nombre_mineurs)) {
                if (value > req.body.indicateurs[key].nombre_mineurs) {
                    throw new Error('Le nombre d\'autres scolarisations ne peut être supérieur au nombre de mineurs concernés par l\'action');
                }
            } else if (Number.isInteger(req.body.indicateurs[key].nombre_personnes) && value > req.body.indicateurs[key].nombre_personnes) {
                throw new Error('Le nombre d\'autres scolarisations ne peut être supérieur au nombre de personnes concernées par l\'action');
            }

            return true;
        }),
    body('indicateurs.*.scolaire_nombre_autre')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),
];
