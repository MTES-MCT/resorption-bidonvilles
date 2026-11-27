import ExcelJS from 'exceljs';
import ServiceError from '#server/errors/ServiceError';

import { AuthUser } from '#server/middlewares/authMiddleware';
import actionModel from '#server/models/actionModel';
import permissionUtils from '#server/utils/permission';
import { WhereClauseGroup } from '#server/models/_common/types/Where.d';
import { ReportFilters } from '#server/models/actionModel/fetchReport/ReportFilters.d';
import toFreshnessRow from '#server/models/actionModel/_common/toFreshnessRow';
import computeActionFreshness from '#server/models/actionModel/_common/computeActionFreshness';
import { ActionMetricsRow } from '#server/models/actionModel/fetch/fetchMetrics';
import { ActionReportRow } from '#root/types/resources/Action.d';
import generateExportFile from './exportActions.generateExportFile';

// null = accès complet aux financements (aucune restriction par action)
const calculateAllowedActionsForFinances = (financeClauseGroup: WhereClauseGroup | null): number[] | null => {
    if (!financeClauseGroup?.actions) {
        return null;
    }

    return (financeClauseGroup.actions.value as number[]) ?? [];
};

/**
 * Calcule la liste des départements autorisés pour l'utilisateur
 * Si l'utilisateur a accès national, retourne null (tous les départements)
 * Sinon retourne la liste des codes départements autorisés
 */
function calculateAllowedDepartements(user: AuthUser, actionClauseGroup: object): string[] | null {
    // Si actionClauseGroup est vide, l'utilisateur a accès national
    if (Object.keys(actionClauseGroup).length === 0) {
        return null;
    }

    // Extraire les départements autorisés depuis les clauses
    const allowedDepts: Set<string> = new Set();

    // Vérifier si l'utilisateur a accès via intervention_areas
    if (user.intervention_areas?.is_national) {
        return null;
    }

    if (user.intervention_areas?.areas) {
        user.intervention_areas.areas.forEach((area) => {
            // les zones de type région ne sont pas traitées ici : elles sont filtrées en SQL
            if (area.type === 'departement') {
                allowedDepts.add(area.departement.code);
            }
        });
    }

    // Si on n'a pas pu déterminer les départements via intervention_areas,
    // on retourne null pour laisser passer tous les départements présents dans les données
    // (qui sont déjà filtrés par la requête SQL)
    return allowedDepts.size > 0 ? Array.from(allowedDepts) : null;
}

function applyFreshness(rows: ActionReportRow[], metrics: ActionMetricsRow[], now: Date): ActionReportRow[] {
    const freshnessRowsByAction = new Map<number, ReturnType<typeof toFreshnessRow>[]>();
    metrics.forEach((metric) => {
        const freshnessRows = freshnessRowsByAction.get(metric.action_id) ?? [];
        freshnessRows.push(toFreshnessRow(metric));
        freshnessRowsByAction.set(metric.action_id, freshnessRows);
    });

    return rows.map((row) => {
        const freshness = computeActionFreshness(row.started_on, row.ended_on, freshnessRowsByAction.get(row.action_id) ?? [], now);

        return {
            ...row,
            is_active_previous_year: freshness.isActivePreviousYear,
            indicators_up_to_date_90d: freshness.isUpToDate90Days,
            indicators_up_to_date_180d: freshness.isUpToDate180Days,
        };
    });
}

const exportActions = async (user: AuthUser, year: string, filters: ReportFilters = {}): Promise<ExcelJS.Buffer> => {
    // Vérifier si l'utilisateur a la permission d'exporter les actions
    const exportPermission = permissionUtils.getPermission(user, 'export', 'action');
    if (exportPermission === null) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'exporter les actions'));
    }

    // Calculer les filtres territoriaux pour les actions
    const actionClauseGroup = permissionUtils.where().can(user).do('read', 'action');
    if (actionClauseGroup === null) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas accès aux actions'));
    }

    // Calculer les filtres territoriaux pour les financements
    const financeClauseGroup = permissionUtils.where().can(user).do('access', 'action_finances');
    const includeFinances = financeClauseGroup !== null;

    // Calculer les départements autorisés pour l'export
    const allowedDepartements = calculateAllowedDepartements(user, actionClauseGroup);

    // Calculer les actions autorisées pour les financements
    const allowedFinanceActions = calculateAllowedActionsForFinances(financeClauseGroup);

    // on collecte les données et on génère le fichier excel
    let data: ActionReportRow[];

    // Si l'année n'est pas précisée, calcul de l'année en cours
    let fetchedYear = new Date().getFullYear() - 1;
    if (year) {
        fetchedYear = Number.parseInt(year, 10);
    }
    // même date de référence pour la requête du rapport et le calcul de fraîcheur
    const now = new Date();
    try {
        // Récupération des données avec filtres territoriaux et filtres de la liste
        data = await actionModel.fetchReport(fetchedYear, actionClauseGroup, financeClauseGroup, filters, now);
    } catch (error) {
        throw new ServiceError(
            'fetch_failed',
            error instanceof Error ? error : new Error('Une erreur inconnue est survenue'),
        );
    }

    if (data.length === 0) {
        throw new ServiceError('no_action_to_export', new Error('Il n\'y a aucune action à exporter'));
    }

    // Règle « indicateurs à jour » partagée avec la liste
    try {
        const metrics: ActionMetricsRow[] = await actionModel.fetchMetrics(data.map(row => row.action_id));
        data = applyFreshness(data, metrics, now);
    } catch (error) {
        throw new ServiceError(
            'fetch_failed',
            error instanceof Error ? error : new Error('Une erreur inconnue est survenue'),
        );
    }

    try { // Génération du fichier Excel
        const buffer = await generateExportFile(data, fetchedYear, includeFinances, allowedDepartements, allowedFinanceActions, now);
        return buffer;
    } catch (error) {
        throw new ServiceError('export_failed', error instanceof Error ? error : new Error('Une erreur inconnue est survenue'));
    }
};

export default exportActions;
