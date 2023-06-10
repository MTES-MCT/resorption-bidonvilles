import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { getNationMetrics, getDepartementMetrics } from "@/api/metrics.api";

export const useMetricsStore = defineStore("metrics", () => {
    const nationStatus = ref(null); // null: lancement, 'init': initialisation, 'loaded': chargé, 'refresh': màj
    const error = ref(null);
    const metrics = ref([]);
    const metricsByDepartement = ref({});
    const selection = ref([]);
    const collapsedStatuses = ref({});

    function reset() {
        nationStatus.value = null;
        error.value = null;
        metrics.value = [];
        metricsByDepartement.value = {};
        selection.value = [];
        collapsedStatuses.value = {};
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        nationStatus,
        error,
        metrics,
        metricsByDepartement,
        collapsedStatuses,
        selection,
        async load(from, to) {
            if (
                nationStatus.value === "init" ||
                nationStatus.value === "refresh"
            ) {
                return null;
            }

            nationStatus.value =
                nationStatus.value === "loaded" ? "refresh" : "init";
            metrics.value = [];
            try {
                metrics.value = await getNationMetrics(from, to);
                nationStatus.value = "loaded";
                return metrics.value;
            } catch (e) {
                error.value =
                    e?.user_message || "Une erreur inconnue est survenue";
                nationStatus.value = null;
                return null;
            }
        },
        async fetchDepartement(departementCode) {
            const metrics = await getDepartementMetrics(departementCode);
            metricsByDepartement.value[departementCode] = metrics;
            return metrics;
        },
    };
});
