import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { trackEvent } from "@/helpers/matomo";

const departementMetricsStore = useDepartementMetricsStore();

/**
 * @typedef {'situation-a-date' | '7-derniers-jours' | 'mois-passe' | 'annee-ecoulee' | '2-annees-ecoulees'} DateRangeOption
 */

/**
 * Met à jour la plage de dates pour les statistiques départementales
 * @param {DateRangeOption | null} dateRange - Option de plage temporelle sélectionnée
 * @param {Date | null} from - Date de début (optionnelle)
 * @param {Date | null} to - Date de fin (optionnelle)
 */
export default (dateRange = null, from = null, to = null) => {
    const previousActiveTab = departementMetricsStore.activeTab;

    if (dateRange === "situation-a-date") {
        departementMetricsStore.currentFormat = "table";
        departementMetricsStore.activeTab = "summary";
        return;
    }

    departementMetricsStore.currentFormat = "summary";
    departementMetricsStore.activeTab = previousActiveTab;

    if (dateRange) {
        if (dateRange === "2-annees-ecoulees") {
            from = new Date(
                new Date().setFullYear(new Date().getFullYear() - 2)
            );
            to = new Date(new Date().setDate(new Date().getDate() - 1));
        }
        if (dateRange === "annee-ecoulee") {
            from = new Date(
                new Date().setFullYear(new Date().getFullYear() - 1)
            );
            to = new Date(new Date().setDate(new Date().getDate() - 1));
        }
        if (dateRange === "mois-passe") {
            from = new Date(new Date().setMonth(new Date().getMonth() - 1));
            to = new Date(new Date().setDate(new Date().getDate() - 1));
        }
        if (dateRange === "7-derniers-jours") {
            from = new Date(new Date().setDate(new Date().getDate() - 7));
            to = new Date(new Date().setDate(new Date().getDate() - 1));
        }
    }

    if (from && to) {
        departementMetricsStore.evolution.from = from;
        departementMetricsStore.evolution.to = to;
        trackEvent(
            "Visualisation des données départementales",
            "Changement dates",
            `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
        );
        departementMetricsStore.fetchEvolution(
            departementMetricsStore.departement
        );
    }
};
