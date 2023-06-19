import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { getDepartementMetrics } from "@/api/metrics.api";
import sortFn from "@/components/DonneesStatistiquesDepartement/DonneesStatistiquesDepartement.sort";
export const useDepartementMetricsStore = defineStore(
    "departementMetrics",
    () => {
        const departement = ref(null);
        const activeTab = ref("summary");
        const error = ref(null);
        const sort = ref({
            summary: { id: "city_name", order: "asc" },
            inhabitants: { id: "city_name", order: "asc" },
            livingConditions: { id: "city_name", order: "asc" },
            justice: { id: "city_name", order: "asc" },
        });
        const metrics = ref({});

        const filteredMetrics = computed(() => {
            if (
                !metrics.value ||
                !departement.value ||
                !metrics.value[departement.value]
            ) {
                return null;
            }
            return {
                ...metrics.value[departement.value],
                cities: metrics.value[departement.value].cities.sort((a, b) =>
                    sortFn[activeTab.value][sort.value[activeTab.value].id](
                        a,
                        b,
                        sort.value[activeTab.value].order
                    )
                ),
            };
        });

        function reset() {
            error.value = null;
            metrics.value = {};
        }

        const { bus } = useEventBus();
        watch(() => bus.value.get("new-user"), reset);
        reset();

        return {
            departement,
            activeTab,
            error,
            filteredMetrics,
            sort,
            metrics,
            async fetchDepartement(departementCode) {
                departement.value = departementCode;
                const response = await getDepartementMetrics(departementCode);
                metrics.value[departementCode] = response;
                return response;
            },
        };
    }
);
