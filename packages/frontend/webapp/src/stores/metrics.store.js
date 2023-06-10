import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { getNationMetrics } from "@/api/metrics.api";

export const useMetricsStore = defineStore("metrics", () => {
    const nationStatus = ref(null); // null: lancement, 'init': initialisation, 'loaded': chargé, 'refresh': màj
    const error = ref(null);
    const metrics = ref([]);
    const selection = ref([]);
    const collapsedStatuses = ref({});
    const from = ref(new Date());
    const to = ref(new Date());
    const loaded = ref({
        from: null,
        to: null,
    });

    function reset() {
        nationStatus.value = null;
        error.value = null;
        metrics.value = [];
        selection.value = [];
        collapsedStatuses.value = {};
        from.value.setTime(new Date());
        to.value.setTime(new Date());

        from.value.setDate(from.value.getDate() - 8);
        to.value.setDate(to.value.getDate() - 1);
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        nationStatus,
        error,
        from,
        to,
        loadedDates: loaded,
        metrics,
        collapsedStatuses,
        selection,
        async load() {
            if (
                nationStatus.value === "init" ||
                nationStatus.value === "refresh"
            ) {
                return null;
            }

            if (
                loaded.value.from &&
                loaded.value.from.toISOString().slice(0, 10) ===
                    from.value.toISOString().slice(0, 10) &&
                loaded.value.to &&
                loaded.value.to.toISOString().slice(0, 10) ===
                    to.value.toISOString().slice(0, 10)
            ) {
                return null;
            }

            nationStatus.value =
                nationStatus.value === "loaded" ? "refresh" : "init";
            metrics.value = [];
            try {
                metrics.value = await getNationMetrics(from.value, to.value);
                nationStatus.value = "loaded";
                loaded.value.from = new Date(from.value);
                loaded.value.to = new Date(to.value);
                return metrics.value;
            } catch (e) {
                error.value =
                    e?.user_message || "Une erreur inconnue est survenue";
                nationStatus.value = null;
                return null;
            }
        },
    };
});
