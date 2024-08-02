import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import {
    getDepartementMetrics,
    getDepartementMetricsEvolution,
} from "@/api/metrics.api";
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
            livingConditionsByInhabitant: { id: "city_name", order: "asc" },
            livingConditionsByTown: { id: "city_name", order: "asc" },
            justice: { id: "city_name", order: "asc" },
        });
        const metrics = ref({});
        const currentFormat = ref("summary");
        const evolution = {
            from: ref(new Date()),
            to: ref(new Date()),
            loaded: ref({
                from: null,
                to: null,
            }),
            isLoading: ref(null),
            error: ref(null),
            data: ref(null),
        };
        const collapsedCities = ref({});
        const lastMapView = ref(null);

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
                cities: metrics.value[departement.value].cities
                    .sort((a, b) =>
                        sortFn[activeTab.value][
                            sort.value[activeTab.value].id
                        ].city_level(a, b, sort.value[activeTab.value].order)
                    )
                    .map((city) => {
                        return {
                            ...city,
                            town: city.towns.sort((a, b) =>
                                sortFn[activeTab.value][
                                    sort.value[activeTab.value].id
                                ].town_level(
                                    a,
                                    b,
                                    sort.value[activeTab.value].order
                                )
                            ),
                        };
                    }),
            };
        });

        function reset() {
            departement.value = null;
            activeTab.value = "summary";
            currentFormat.value = "summary";
            error.value = null;
            sort.value = {
                summary: { id: "city_name", order: "asc" },
                inhabitants: { id: "city_name", order: "asc" },
                livingConditionsByInhabitant: { id: "city_name", order: "asc" },
                livingConditionsByTown: { id: "city_name", order: "asc" },
                justice: { id: "city_name", order: "asc" },
            };
            metrics.value = {};
            collapsedCities.value = {};
            evolution.from.value.setTime(new Date());
            evolution.to.value.setTime(new Date());
            evolution.loaded.value = {
                from: null,
                to: null,
            };
            evolution.isLoading.value = null;
            evolution.error.value = null;
            evolution.data.value = null;
            lastMapView.value = null;
            evolution.from.value.setFullYear(
                evolution.from.value.getFullYear() - 2
            );
            evolution.to.value.setDate(evolution.to.value.getDate() - 1);
        }

        const { bus } = useEventBus();
        watch(() => bus.value.get("new-user"), reset);
        reset();

        return {
            reset,
            departement,
            activeTab,
            error,
            filteredMetrics,
            sort,
            metrics,
            currentFormat,
            evolution,
            lastMapView,
            collapsedCities,
            async fetchEvolution(departementCode) {
                if (evolution.isLoading.value === true) {
                    return;
                }

                evolution.isLoading.value = true;
                evolution.error.value = null;
                evolution.data.value = null;
                evolution.loaded.value = {
                    from: null,
                    to: null,
                };

                try {
                    evolution.data.value = await getDepartementMetricsEvolution(
                        departementCode,
                        evolution.from.value,
                        evolution.to.value
                    );

                    evolution.loaded.value.from = new Date(
                        evolution.from.value
                    );
                    evolution.loaded.value.to = new Date(evolution.to.value);
                } catch (error) {
                    evolution.error.value =
                        error?.user_message ||
                        "Une erreur inconnue est survenue";
                }

                evolution.isLoading.value = false;
            },
            async fetchDepartement(departementCode) {
                departement.value = departementCode;
                const response = await getDepartementMetrics(departementCode);
                metrics.value[departementCode] = response;
                collapsedCities.value = {};
                return response;
            },
        };
    }
);
