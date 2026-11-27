import { param, query, type ValidationChain } from 'express-validator';
import { type ReportFilters, type ReportLocationFilter } from '#server/models/actionModel/fetchReport/ReportFilters.d';

type Query = Record<string, unknown>;

const LOCATION_TYPE_UIDS = ['nation', 'metropole', 'outremer', 'region', 'departement', 'epci', 'city', 'organization'];
const LOCATION_TYPE_UIDS_WITH_CODE = ['region', 'departement', 'epci', 'city'];
const MAX_INTEGER = 2147483647;
const MAX_LIST_SIZE = 20;

function isAbsent(value: unknown): boolean {
    return value === undefined || value === null || value === '';
}

// Un paramètre scalaire envoyé en tableau ou en objet est rejeté (confusion de type)
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isPositiveInteger(value: unknown): boolean {
    return isString(value) && /^\d{1,10}$/.test(value) && Number.parseInt(value, 10) >= 1 && Number.parseInt(value, 10) <= MAX_INTEGER;
}

// Valeur unique ou tableau de chaînes respectant le motif (les chaînes vides sont tolérées, puis retirées)
function isListOfStrings(value: unknown, pattern: RegExp): boolean {
    if (value === undefined) {
        return true;
    }

    const values: unknown[] = Array.isArray(value) ? value : [value];
    return values.every(item => isString(item) && (item === '' || pattern.test(item)));
}

function toListOfStrings(value: unknown): string[] {
    const values: unknown[] = Array.isArray(value) ? value : [value];
    return values.filter((item): item is string => isString(item) && item !== '');
}

function isShortEnoughList(value: unknown): boolean {
    return !Array.isArray(value) || value.length <= MAX_LIST_SIZE;
}

function isValidYear(value: unknown): boolean {
    if (!isString(value) || !/^\d{4}$/.test(value)) {
        return false;
    }

    const year = Number.parseInt(value, 10);
    return year >= 2000 && year <= 2100;
}

function createListValidator(field: string, pattern: RegExp, message: string, sizeMessage: string): ValidationChain {
    return query(field)
        .custom(value => isListOfStrings(value, pattern))
        .withMessage(message)
        .bail()
        .custom(isShortEnoughList)
        .withMessage(sizeMessage)
        .bail()
        .customSanitizer(value => (value === undefined ? value : toListOfStrings(value)));
}

export default [
    param('year')
        .custom(isValidYear)
        .withMessage('L\'année d\'export doit être une année valide (entre 2000 et 2100)'),

    query('status')
        .optional({ checkFalsy: true })
        .custom(isString)
        .withMessage('Le statut doit être "open" ou "closed"')
        .bail()
        .isIn(['open', 'closed'])
        .withMessage('Le statut doit être "open" ou "closed"'),

    query('search')
        .optional({ checkFalsy: true })
        .custom(isString)
        .withMessage('La recherche doit être une chaîne de caractères')
        .bail()
        .isLength({ max: 200 })
        .withMessage('La recherche ne peut pas dépasser 200 caractères'),

    query('locationType')
        .optional({ checkFalsy: true })
        .custom(value => isString(value) && /^[a-z_]{1,30}$/.test(value))
        .withMessage('Le type de localisation est invalide'),

    query('locationTypeUid')
        .optional({ checkFalsy: true })
        .custom(value => isString(value) && LOCATION_TYPE_UIDS.includes(value))
        .withMessage('Le type de localisation est inconnu'),

    query('locationCode')
        .custom((value, { req }) => {
            if (isAbsent(value)) {
                if (LOCATION_TYPE_UIDS_WITH_CODE.includes(req.query?.locationTypeUid)) {
                    throw new Error('Le code de la localisation est obligatoire');
                }

                return true;
            }

            if (!isString(value) || !/^[A-Za-z0-9]{1,10}$/.test(value)) {
                throw new Error('Le code de la localisation est invalide');
            }

            return true;
        }),

    query('locationOrganizationId')
        .custom((value, { req }) => {
            if (isAbsent(value)) {
                if (req.query?.locationTypeUid === 'organization') {
                    throw new Error('L\'identifiant de la structure est obligatoire');
                }

                return true;
            }

            if (!isPositiveInteger(value)) {
                throw new Error('L\'identifiant de la structure doit être un nombre entier');
            }

            return true;
        })
        .bail()
        .customSanitizer(value => (isString(value) && isPositiveInteger(value) ? Number.parseInt(value, 10) : value)),

    query('organizationId')
        .optional({ checkFalsy: true })
        .custom(isPositiveInteger)
        .withMessage('L\'identifiant de structure doit être un nombre entier')
        .bail()
        .toInt(),

    createListValidator('topic', /^\w{1,50}$/, 'Les thématiques doivent être alphanumériques (50 caractères maximum)', 'Vous ne pouvez pas sélectionner plus de 20 thématiques'),
    createListValidator('interventionLocation', /^\w{1,50}$/, 'Les lieux d\'intervention doivent être alphanumériques (50 caractères maximum)', 'Vous ne pouvez pas sélectionner plus de 20 lieux d\'intervention'),
    createListValidator('dihalFinancing', /^(all|\d{4})$/, 'Le financement DIHAL doit être "all" ou une année à 4 chiffres', 'Vous ne pouvez pas sélectionner plus de 20 années de financement DIHAL'),
];

function buildLocation(source: Query): ReportLocationFilter | undefined {
    const {
        locationTypeUid, locationType, locationCode, locationOrganizationId,
    } = source;

    if (!isString(locationTypeUid) || locationTypeUid === '') {
        return undefined;
    }

    const location: ReportLocationFilter = {
        type: isString(locationType) && locationType !== '' ? locationType : locationTypeUid,
        typeUid: locationTypeUid,
    };

    if (isString(locationCode) && locationCode !== '') {
        location.code = locationCode;
    }

    if (typeof locationOrganizationId === 'number') {
        location.organizationId = locationOrganizationId;
    }

    return location;
}

/**
 * Construit les filtres du rapport à partir de req.query déjà validé et normalisé par les validateurs ci-dessus.
 * Une clé absente désigne un filtre inactif (aucune clé n'est posée à undefined).
 */
export function extractReportFilters(source: Query): ReportFilters {
    const filters: ReportFilters = {};

    if (source.status === 'open' || source.status === 'closed') {
        filters.status = source.status;
    }

    if (isString(source.search) && source.search !== '') {
        filters.search = source.search;
    }

    if (typeof source.organizationId === 'number') {
        filters.organizationId = source.organizationId;
    }

    const location = buildLocation(source);
    if (location !== undefined) {
        filters.location = location;
    }

    (['topic', 'interventionLocation', 'dihalFinancing'] as const).forEach((field) => {
        const values = toListOfStrings(source[field]);
        if (values.length > 0) {
            filters[field] = values;
        }
    });

    return filters;
}
