import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { trackEvent } from "@/helpers/matomo";

const departementMetricsStore = useDepartementMetricsStore();

export default (dateRange = null, from = null, to = null) => {
    departementMetricsStore.currentFormat = "summary";
    departementMetricsStore.activeTab = "summary";
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
        if (dateRange === "situation-a-date") {
            departementMetricsStore.currentFormat = "table";
            return;
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
