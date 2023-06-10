import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { getNationMetrics, getDepartementMetrics } from "@/api/metrics.api";

export const useMetricsStore = defineStore("metrics", () => {
    const isLoading = ref(null);
    const error = ref(null);
    const metrics = ref([]);
    const metricsByDepartement = ref({});
    const selection = ref([]);
    const collapsedStatuses = ref({});

    function reset() {
        isLoading.value = null;
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
        isLoading,
        error,
        metrics,
        metricsByDepartement,
        collapsedStatuses,
        selection,
        async load(from, to) {
            if (isLoading.value === true) {
                return null;
            }

            isLoading.value = true;
            metrics.value = [];
            try {
                metrics.value = await getNationMetrics(from, to);
                isLoading.value = false;
                return metrics.value;
            } catch (e) {
                error.value =
                    e?.user_message || "Une erreur inconnue est survenue";
                isLoading.value = false;
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
