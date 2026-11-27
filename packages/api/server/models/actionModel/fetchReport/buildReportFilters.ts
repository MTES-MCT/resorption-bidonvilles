import { ReportFilters, ReportLocationFilter } from './ReportFilters.d';

type ReportFiltersClauses = {
    where: string[],
    replacements: Record<string, unknown>,
};

/* eslint-disable no-param-reassign */
const OVERSEAS_REGIONS = ['01', '02', '03', '04', '06'];

// les sous-requêtes portent sur les noms de tables réels (la CTE agrégée des opérateurs a été renommée dans fetchReport)
const OPERATORS_OF_ACTION = `SELECT 1 FROM action_operators
    JOIN users ON users.user_id = action_operators.fk_user
    WHERE action_operators.fk_action = actions.action_id
    AND users.anonymized_at IS NULL`;

// statut comparé en instant UTC des deux côtés (ended_at est une date sans fuseau, enregistrée en UTC)
const ENDED_AT_INSTANT = '(actions.ended_at::timestamp AT TIME ZONE \'UTC\')';
const NOW_INSTANT = 'CAST(:filter_now AS timestamptz)';

function escapeLikePattern(value: string): string {
    return value.replace(/[\\%_]/g, match => `\\${match}`);
}

function hasItems(values: string[] | undefined): values is string[] {
    return Array.isArray(values) && values.length > 0;
}

function buildOperatorOrganizationClause(replacementName: string): string {
    return `EXISTS (${OPERATORS_OF_ACTION} AND users.fk_organization = :${replacementName})`;
}

function buildSearchClause(): string {
    const organizationsOf = (table: 'action_operators' | 'action_managers'): string => `EXISTS (
        SELECT 1 FROM ${table}
        JOIN users ON users.user_id = ${table}.fk_user
        JOIN organizations ON organizations.organization_id = users.fk_organization
        WHERE ${table}.fk_action = actions.action_id
        AND users.anonymized_at IS NULL
        AND (organizations.name ILIKE :filter_search OR organizations.abbreviation ILIKE :filter_search)
    )`;

    return `(actions.name ILIKE :filter_search OR ${organizationsOf('action_operators')} OR ${organizationsOf('action_managers')})`;
}

function buildDihalFinancingClause(dihalFinancing: string[], replacements: Record<string, unknown>): string {
    const base = `EXISTS (SELECT 1 FROM action_finances
        WHERE action_finances.fk_action = actions.action_id
        AND action_finances.fk_action_finance_type = 'dedie'`;

    // "all" : toute année (comme la liste, une année mêlée à "all" est ignorée)
    if (dihalFinancing.includes('all')) {
        return `${base})`;
    }

    replacements.filter_dihal_years = dihalFinancing;
    return `${base} AND action_finances.year IN (:filter_dihal_years))`;
}

// Reproduit le comportement réel du front : action.location ne porte que region et departement
function buildLocationClause(
    location: ReportLocationFilter,
    replacements: Record<string, unknown>,
): string | null {
    switch (location.typeUid) {
        case 'nation':
            return null;

        case 'organization':
            if (location.organizationId === undefined || location.organizationId === null) {
                return 'FALSE';
            }
            replacements.filter_location_organization_id = location.organizationId;
            return buildOperatorOrganizationClause('filter_location_organization_id');

        case 'metropole':
            replacements.filter_overseas_regions = OVERSEAS_REGIONS;
            return 'r.code NOT IN (:filter_overseas_regions)';

        case 'outremer':
            replacements.filter_overseas_regions = OVERSEAS_REGIONS;
            return 'r.code IN (:filter_overseas_regions)';

        case 'region':
        case 'departement':
            if (location.code === undefined || location.code === null) {
                return 'FALSE';
            }
            replacements.filter_location_code = String(location.code);
            return `${location.typeUid === 'region' ? 'r' : 'd'}.code = :filter_location_code`;

        // epci, city et tout type inconnu : aucune action ne correspond
        default:
            return 'FALSE';
    }
}

/**
 * Traduit les filtres de la liste en fragments SQL (à joindre par AND) et en remplacements nommés préfixés par
 * `filter_`. Aucune valeur saisie n'est interpolée dans le SQL. Fonction pure.
 * Alias attendus dans la requête principale : actions, d (departements), r (regions).
 */
export default function buildReportFilters(filters: ReportFilters, now: Date): ReportFiltersClauses {
    const where: string[] = [];
    const replacements: Record<string, unknown> = {};

    if (filters.organizationId !== undefined && filters.organizationId !== null) {
        replacements.filter_organization_id = filters.organizationId;
        where.push(buildOperatorOrganizationClause('filter_organization_id'));
    }

    if (filters.location) {
        const clause = buildLocationClause(filters.location, replacements);
        if (clause !== null) {
            where.push(clause);
        }
    }

    if (filters.status === 'open' || filters.status === 'closed') {
        replacements.filter_now = now;
        where.push(filters.status === 'open'
            ? `(actions.ended_at IS NULL OR ${ENDED_AT_INSTANT} > ${NOW_INSTANT})`
            : `(actions.ended_at IS NOT NULL AND ${ENDED_AT_INSTANT} < ${NOW_INSTANT})`);
    }

    // la recherche est ignorée quand une localisation est active
    if (!filters.location && filters.search) {
        replacements.filter_search = `%${escapeLikePattern(filters.search)}%`;
        where.push(buildSearchClause());
    }

    if (hasItems(filters.topic)) {
        replacements.filter_topic = filters.topic;
        where.push(`EXISTS (SELECT 1 FROM action_topics
            WHERE action_topics.fk_action = actions.action_id
            AND action_topics.fk_topic IN (:filter_topic))`);
    }

    if (hasItems(filters.interventionLocation)) {
        replacements.filter_intervention_location = filters.interventionLocation;
        where.push('actions.location_type IN (:filter_intervention_location)');
    }

    if (hasItems(filters.dihalFinancing)) {
        where.push(buildDihalFinancingClause(filters.dihalFinancing, replacements));
    }

    return { where, replacements };
}
