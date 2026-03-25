import ServiceError from '#server/errors/ServiceError';

import { AuthUser } from '#server/middlewares/authMiddleware';
import actionModel from '#server/models/actionModel';
import permissionUtils from '#server/utils/permission';
import generateExportFile from './exportActions.generateExportFile';
import { ActionReportRow } from '#root/types/resources/Action.d';


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
            if (area.type === 'departement') {
                allowedDepts.add(area.departement.code);
            } else if (area.type === 'region') {
                // Pour les régions, on devrait récupérer tous les départements de la région
                // Pour l'instant, on laisse le filtrage SQL gérer cela
                // Les départements seront présents dans les données retournées
            }
        });
    }

    // Si on n'a pas pu déterminer les départements via intervention_areas,
    // on retourne null pour laisser passer tous les départements présents dans les données
    // (qui sont déjà filtrés par la requête SQL)
    return allowedDepts.size > 0 ? Array.from(allowedDepts) : null;
}


const exportActions = async (user: AuthUser, year: string, dihalFinancing = false) => {
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

    // on collecte les données et on génère le fichier excel
    let data: ActionReportRow[];

    // Si l'année n'est pas précisée, calcul de l'année en cours
    let fetchedYear = new Date().getFullYear() - 1;
    if (year) {
        fetchedYear = Number.parseInt(year, 10);
    }
    try {
        // Récupération des données avec filtres territoriaux
        data = await actionModel.fetchReport(fetchedYear, actionClauseGroup, financeClauseGroup);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // Filtrage par financement DIHAL si demandé
    if (dihalFinancing) {
        data = data.filter(action => action.finance_dedie > 0);
    }

    if (data.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Il n\'y a aucune action à exporter'));
    }

    const buffer = await generateExportFile(data, includeFinances, allowedDepartements);
    return buffer;
};

export default exportActions;
