/* eslint-disable newline-per-chained-call */
import geoModel from '#server/models/geoModel';
import { Location } from '#server/models/geoModel/Location.d';
import shantytownModel from '#server/models/shantytownModel';
import topicModel from '#server/models/topicModel';
import userModel from '#server/models/userModel';
import can from '#server/utils/permission/can';
import { body, ValidationChain } from 'express-validator';
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

// Fonction factory qui génère un validateur d'utilisateurs
const createUserValidator = (fieldName: string | string[] | undefined, displayName: string) => body(fieldName)
    .exists({ checkNull: true }).bail()
    .withMessage(`Le champ "${displayName}" est obligatoire`)
    .isArray().bail()
    .withMessage('Le format des utilisateurs ciblés n\'est pas valide')
    .isLength({ min: 1 }).bail()
    .withMessage(`Le champ "${displayName}" est obligatoire`)
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
    });

// Fonction factory qui génère un validateur d'indicateur numérique
const createIndicatorValidator = (
    fieldName: string,
    displayName: string,
    options: {
        topic?: string | null;
        minValue?: number;
        maxComparisons?: Array<{ field: string; errorMessage: string; priority?: number }>;
    } = {},
) => {
    const {
        topic = null, // Topic requis (ex: 'school', 'health', 'work')
        minValue = 0, // Valeur minimale acceptée
        maxComparisons = [], // Tableau de comparaisons: [{ field, errorMessage, priority }]
    } = options;

    const validators: ValidationChain[] = [];

    // Validation principale
    let indicatorValidator = body(fieldName);

    // Si un topic est requis, ajouter la condition
    if (topic) {
        indicatorValidator = indicatorValidator.if((value, { req }) => req.body.topics?.includes?.(topic));
    }

    indicatorValidator = indicatorValidator
        .optional({ nullable: true, checkFalsy: false })
        .customSanitizer(value => (value === '' || value === null || value === undefined ? null : Number.parseInt(value, 10)))
        .custom((value) => {
            if (value === null || value === undefined) {
                return true; // La valeur est optionnelle, donc null/undefined est valide
            }
            if (!Number.isInteger(value)) {
                throw new TypeError(`Le champ "${displayName}" doit être un nombre`);
            }
            if (value < minValue) {
                throw new Error(`Le champ "${displayName}" ne peut pas être inférieur à ${minValue}`);
            }
            return true;
        })
        .customSanitizer(value => (Number.isInteger(value) ? value : null));

    // Ajouter les comparaisons personnalisées
    if (maxComparisons.length > 0) {
        indicatorValidator = indicatorValidator.custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            const indicateur = req.body.indicateurs[key];

            // Trier les comparaisons par priorité (si fournie)
            const sortedComparisons = [...maxComparisons].sort((a, b) => (a.priority || 0) - (b.priority || 0));

            // Vérifier chaque comparaison dans l'ordre de priorité
            let comparisonMatched = false;
            sortedComparisons.forEach((comparison) => {
                if (comparisonMatched) {
                    return;
                }

                const { field, errorMessage } = comparison;

                if (Number.isInteger(indicateur[field])) {
                    if (value > indicateur[field]) {
                        throw new Error(errorMessage);
                    }
                    // Si une comparaison réussit, on s'arrête (pour gérer les fallbacks)
                    comparisonMatched = true;
                }
            });

            return true;
        });
    }

    validators.push(indicatorValidator);

    return validators;
};

// Helpers pour réduire la duplication dans INDICATOR_CONFIGS
type MaxComparison = { field: string; errorMessage: string; priority?: number };

function maxComp(field: string, errorMessage: string, priority?: number): MaxComparison {
    return priority === undefined ? { field, errorMessage } : { field, errorMessage, priority };
}

function simpleMax(indicatorLabel: string, targetField: string, targetLabel: string): MaxComparison[] {
    return [maxComp(targetField, `Le nombre de ${indicatorLabel} ne peut être supérieur au nombre de ${targetLabel}`)];
}

function actionMax(indicatorLabel: string): MaxComparison[] {
    return [maxComp('nombre_personnes', `Le nombre de ${indicatorLabel} ne peut être supérieur au nombre de personnes concernées par l'action`)];
}

function schoolMinorsMax(indicatorLabel: string): MaxComparison[] {
    return [
        maxComp('nombre_mineurs', `Le nombre de ${indicatorLabel} ne peut être supérieur au nombre de mineurs concernés par l'action`, 1),
        maxComp('nombre_personnes', `Le nombre de ${indicatorLabel} ne peut être supérieur au nombre de personnes concernées par l'action`, 2),
    ];
}

type IndicatorConfig = {
    fieldName: string;
    displayName: string;
    options?: {
        topic?: string | null;
        minValue?: number;
        maxComparisons?: MaxComparison[];
    };
};

const INDICATOR_CONFIGS: IndicatorConfig[] = [
    {
        fieldName: 'indicateurs.*.nombre_personnes',
        displayName: 'Nombre de personnes',
        options: { minValue: 1 },
    },
    {
        fieldName: 'indicateurs.*.nombre_menages',
        displayName: 'Nombre de ménages',
        options: { minValue: 1, maxComparisons: simpleMax('ménages', 'nombre_personnes', 'personnes') },
    },
    {
        fieldName: 'indicateurs.*.nombre_femmes',
        displayName: 'Nombre de femmes',
        options: { maxComparisons: simpleMax('femmes', 'nombre_personnes', 'personnes') },
    },
    {
        fieldName: 'indicateurs.*.nombre_mineurs',
        displayName: 'Nombre de mineurs',
        options: { maxComparisons: simpleMax('mineurs', 'nombre_personnes', 'personnes') },
    },
    {
        fieldName: 'indicateurs.*.sante_nombre_personnes',
        displayName: 'Nombre de personnes ayant eu un accompagnement vers la santé',
        options: { topic: 'health', maxComparisons: actionMax('personnes ayant eu un accompagnement vers la santé') },
    },
    {
        fieldName: 'indicateurs.*.travail_nombre_personnes',
        displayName: 'Nombre de personnes ayant eu au moins 1 contrat de travail',
        options: { topic: 'work', maxComparisons: actionMax('personnes ayant eu au moins 1 contrat de travail') },
    },
    {
        fieldName: 'indicateurs.*.travail_nombre_femmes',
        displayName: 'Nombre de femmes ayant eu au moins 1 contrat de travail',
        options: {
            topic: 'work',
            maxComparisons: [
                {
                    field: 'travail_nombre_personnes',
                    errorMessage: 'Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de personnes',
                    priority: 1,
                },
                {
                    field: 'nombre_femmes',
                    errorMessage: 'Le nombre de femmes ayant eu au moins 1 contrat de travail ne peut être supérieur au nombre de femmes concernées par l\'action',
                    priority: 2,
                },
            ],
        },
    },
    {
        fieldName: 'indicateurs.*.hebergement_nombre_personnes',
        displayName: 'Nombre de personnes ayant eu accès à un hébergement',
        options: { topic: 'housing', maxComparisons: actionMax('personnes ayant eu accès à un hébergement') },
    },
    {
        fieldName: 'indicateurs.*.hebergement_nombre_menages',
        displayName: 'Nombre de ménages ayant eu accès à un hébergement',
        options: {
            topic: 'housing',
            maxComparisons: [
                maxComp('hebergement_nombre_personnes', 'Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes', 1),
                maxComp('nombre_menages', 'Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de ménages concernés par l\'action', 2),
                maxComp('nombre_personnes', 'Le nombre de ménages ayant eu accès à un hébergement ne peut être supérieur au nombre de personnes concernées par l\'action', 3),
            ],
        },
    },
    {
        fieldName: 'indicateurs.*.logement_nombre_personnes',
        displayName: 'Nombre de personnes ayant eu accès à un logement',
        options: { topic: 'housing', maxComparisons: actionMax('personnes ayant eu accès à un logement') },
    },
    {
        fieldName: 'indicateurs.*.logement_nombre_menages',
        displayName: 'Nombre de ménages ayant eu accès à un logement',
        options: {
            topic: 'housing',
            maxComparisons: [
                maxComp('logement_nombre_personnes', 'Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de personnes', 1),
                maxComp('nombre_menages', 'Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de ménages concernés par l\'action', 2),
                maxComp('nombre_personnes', 'Le nombre de ménages ayant eu accès à un logement ne peut être supérieur au nombre de personnes concernées par l\'action', 3),
            ],
        },
    },
    {
        fieldName: 'indicateurs.*.scolaire_mineurs_trois_ans_et_plus',
        displayName: 'Nombre de mineurs identifiés sur site',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('mineurs identifiés sur site') },
    },
    {
        fieldName: 'indicateurs.*.scolaire_mineurs_moins_de_trois_ans',
        displayName: 'Nombre de mineurs de moins de 3 ans identifiés sur site',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('mineurs de moins de 3 ans identifiés sur site') },
    },
    {
        fieldName: 'scolaire_mediation_moins_de_trois_ans',
        displayName: 'Nombre de mineurs de 3 ans et plus bénéficiant d\'une médiation',
        options: {
            topic: 'school',
            maxComparisons: [maxComp('scolaire_mineurs_moins_de_trois_ans', 'Le nombre de mineurs de moins de 3 ans bénéficiant d\'une médiation ne peut être supérieur au nombre de mineurs de moins de 3 ans identifiés sur site')],
        },
    },
    {
        fieldName: 'scolaire_mediation_trois_ans_et_plus',
        displayName: 'Nombre de mineurs de 3 ans et plus bénéficiant d\'une médiation',
        options: {
            topic: 'school',
            maxComparisons: [maxComp('scolaire_mineurs_trois_ans_et_plus', 'Le nombre de mineurs de 3 ans et plus bénéficiant d\'une médiation ne peut être supérieur au nombre de mineurs de 3 ans et plus identifiés sur site')],
        },
    },
    {
        fieldName: 'indicateurs.*.scolaire_nombre_maternelle',
        displayName: 'Nombre de scolarisés en maternelle',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('scolarisés en maternelle') },
    },
    {
        fieldName: 'indicateurs.*.scolaire_nombre_elementaire',
        displayName: 'Nombre de scolarisés en élémentaire',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('scolarisés en élémentaire') },
    },
    {
        fieldName: 'indicateurs.*.scolaire_nombre_college',
        displayName: 'Nombre de scolarisés au collège',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('scolarisés au collège') },
    },
    {
        fieldName: 'indicateurs.*.scolaire_nombre_lycee',
        displayName: 'Nombre de scolarisés au lycée',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('scolarisés au lycée') },
    },
    {
        fieldName: 'indicateurs.*.scolaire_nombre_autre',
        displayName: 'Autre',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('d\'autres scolarisations') },
    },
    {
        fieldName: 'indicateurs.*.scolaire_mineur_scolarise_dans_annee',
        displayName: 'Mineurs scolarisés dans l\'année',
        options: { topic: 'school', maxComparisons: schoolMinorsMax('mineurs scolarisés dans l\'année') },
    },
];

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
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
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
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
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
                // eslint-disable-next-line no-console
                console.error(e);
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
            req.body.latitude = Number.parseFloat(latitude);
            req.body.longitude = Number.parseFloat(longitude);

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
        .customSanitizer(value => value.map(id => Number.parseInt(id, 10)))
        .custom(async (value, { req }) => {
            let shantytowns = [];
            try {
                shantytowns = await shantytownModel.findAll(req.user, [
                    { shantytown_id: { value } },
                ]);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
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
        .customSanitizer((value) => {
            // Convertit les chaînes vides, null ou undefined en null
            if (value === '' || value === null || value === undefined) {
                return null;
            }
            return value;
        }),
    createUserValidator('managers', 'Pilotes de l\'action'),
    createUserValidator('operators', 'Opérateurs de l\'action'),
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
                const year = Number.parseInt(strYear, 10);
                if ((minYear && year < minYear) || (maxYear && year > maxYear)) {
                    throw new Error(`L'année ${year} n'est pas valide`);
                }
            });

            return true;
        }),

    ...INDICATOR_CONFIGS.flatMap(config => createIndicatorValidator(
        config.fieldName,
        config.displayName,
        config.options,
    )),
    body('indicateurs.*.scolaire_mineur_scolarise_dans_annee')
        .custom((value, { req, path }) => {
            if (value === null || value === undefined) {
                return true;
            }

            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            const indicateur = req.body.indicateurs[key];

            // Vérifier que nombre_mineurs est renseigné
            if (!Number.isInteger(indicateur.nombre_mineurs)) {
                throw new Error('Le nombre de mineurs scolarisés dans l\'année ne peut être renseigné que si le nombre total de mineurs concernés par l\'action est également renseigné');
            }

            // Vérifier que la valeur ne dépasse pas le nombre de mineurs
            if (value > indicateur.nombre_mineurs) {
                throw new Error('Le nombre de mineurs scolarisés dans l\'année ne peut pas dépasser le nombre total de mineurs concernés par l\'action');
            }

            // Vérifier par rapport au nombre total d'enfants scolarisés
            const totalScolarises = [
                'scolaire_nombre_maternelle',
                'scolaire_nombre_elementaire',
                'scolaire_nombre_college',
                'scolaire_nombre_lycee',
                'scolaire_nombre_autre',
            ].reduce((total, field) => {
                const val = indicateur[field];
                return Number.isInteger(val) ? total + val : total;
            }, 0);

            if (value < totalScolarises) {
                throw new Error('Le nombre de mineurs scolarisés dans l\'année ne peut pas être inférieur à la somme des mineurs scolarisés par niveau');
            }

            return true;
        })
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    // Validation de la cohérence entre la somme des niveaux scolaires et le nombre total de scolarisés
    body('indicateurs.*.scolaire_nombre_maternelle')
        .if((value, { req }) => req.body.topics?.includes?.('school'))
        .custom((value, { req, path }) => {
            const key = new RegExp(/indicateurs\[(.+)\]/).exec(path)[1];
            const indicateur = req.body.indicateurs[key];

            // Vérifier si le champ scolaire_mineur_scolarise_dans_annee est défini
            if (indicateur.scolaire_mineur_scolarise_dans_annee === null || indicateur.scolaire_mineur_scolarise_dans_annee === undefined) {
                return true; // Ne pas valider si le champ n'est pas défini
            }

            // Calculer la somme des niveaux scolaires
            const niveauxScolaires = [
                'scolaire_nombre_maternelle',
                'scolaire_nombre_elementaire',
                'scolaire_nombre_college',
                'scolaire_nombre_lycee',
                'scolaire_nombre_autre',
            ];

            const totalNiveaux = niveauxScolaires.reduce((sum, niveau) => {
                const val = indicateur[niveau];
                return sum + (Number.isInteger(val) ? val : 0);
            }, 0);

            // Vérifier que la somme des niveaux ne dépasse pas le nombre total de scolarisés
            if (totalNiveaux > indicateur.scolaire_mineur_scolarise_dans_annee) {
                throw new Error('La somme des mineurs scolarisés par niveau ne peut pas dépasser le nombre total de mineurs scolarisés dans l\'année');
            }

            // Vérifier que la somme ne dépasse pas le nombre total de mineurs de 3 ans et plus
            if (Number.isInteger(indicateur.scolaire_mineurs_trois_ans_et_plus) && totalNiveaux > indicateur.scolaire_mineurs_trois_ans_et_plus) {
                throw new Error('La somme des enfants scolarisés par niveau ne peut pas dépasser le nombre total de mineurs de 3 ans et plus identifiés sur site');
            }

            return true;
        }),
];
