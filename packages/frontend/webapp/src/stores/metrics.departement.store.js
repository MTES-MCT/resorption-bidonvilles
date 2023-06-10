import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { getDepartementMetrics } from "@/api/metrics.api";

export const useDepartementMetricsStore = defineStore(
    "departementMetrics",
    () => {
        const error = ref(null);
        const metrics = ref({});

        function reset() {
            error.value = null;
            metrics.value = {};
        }

        const { bus } = useEventBus();
        watch(() => bus.value.get("new-user"), reset);
        reset();

        return {
            error,
            metrics,
            async fetchDepartement(departementCode) {
                const response = await getDepartementMetrics(departementCode);
                metrics.value[departementCode] = response;
                return response;
            },
        };
    }
);
