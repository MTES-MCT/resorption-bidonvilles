import { defineStore } from "pinia";
import moment from "moment";
import { computed, ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { getNationMetrics } from "@/api/metrics.api";
import { getNationMetricsEvolution } from "@/api/metrics.api";
import filterMetrics from "@/utils/filterMetrics";
import parametres from "../components/DonneesStatistiques/DonneesStatistiques.parametres";

export const useMetricsStore = defineStore("metrics", () => {
    const nationStatus = ref(null); // null: lancement, 'init': initialisation, 'loaded': chargé, 'refresh': màj
    const error = ref(null);
    const hexagoneMetrics = ref({});
    const metrics = ref([]);
    const evolution = {
        from: ref(
            new Date(new Date().setFullYear(new Date().getFullYear() - 2))
        ),
        to: ref(
            new Date(
                moment().set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                })
            )
        ),
        data: ref({}),
        isLoading: ref(true),
    };
    const selection = ref([]);
    const collapsedStatuses = ref({});
    const from = ref(new Date());
    const to = ref(new Date());
    const loaded = ref({
        from: null,
        to: null,
    });
    const showParametres = ref(false);
    const parametresDeVue = ref([]);

    const createHexagoneTileMetrics = (fullMetrics) => {
        hexagoneMetrics.value = {
            summary: {
                number_of_towns: {
                    all: fullMetrics.metrics.number_of_towns.to,
                    eu_only:
                        fullMetrics.metrics.number_of_towns_european_10_and_over
                            .to,
                    out_of_date:
                        fullMetrics.metrics.number_of_towns_out_of_date.to,
                    unknown_population:
                        fullMetrics.metrics.number_of_towns_unknown_origin.to,
                },
                number_of_persons: {
                    all: fullMetrics.metrics.number_of_persons.to,
                    eu_only:
                        fullMetrics.metrics
                            .number_of_persons_european_10_and_over.to,
                },
            },
        };
    };

    const filteredMetrics = computed(() => {
        return filterMetrics(
            metrics.value,
            parametres.filter((parametre) =>
                parametresDeVue.value.includes(parametre.id)
            )
        );
    });

    const mergeWaterSnapshots = (endItems, startItems) => {
        const flattenMetrics = (items) =>
            items.flatMap((item) => [
                item,
                ...(item.children?.length ? flattenMetrics(item.children) : []),
            ]);
        const startByUid = new Map(
            flattenMetrics(startItems).map((item) => [item.uid, item])
        );

        for (const item of endItems) {
            const startItem = startByUid.get(item.uid);
            const startTownsWithWater =
                typeof startItem?.metrics.number_of_towns_with_water ===
                "object"
                    ? startItem.metrics.number_of_towns_with_water?.to ?? 0
                    : startItem?.metrics.number_of_towns_with_water ?? 0;
            const startPersonsWithWater =
                typeof startItem?.metrics.number_of_persons_with_water ===
                "object"
                    ? startItem.metrics.number_of_persons_with_water?.to ?? 0
                    : startItem?.metrics.number_of_persons_with_water ?? 0;
            const endTownsWithWater =
                typeof item.metrics.number_of_towns_with_water === "object"
                    ? item.metrics.number_of_towns_with_water?.to ?? 0
                    : item.metrics.number_of_towns_with_water ?? 0;
            const endPersonsWithWater =
                typeof item.metrics.number_of_persons_with_water === "object"
                    ? item.metrics.number_of_persons_with_water?.to ?? 0
                    : item.metrics.number_of_persons_with_water ?? 0;

            item.metrics.number_of_towns_with_water = {
                from: startTownsWithWater,
                to: endTownsWithWater,
            };
            item.metrics.number_of_persons_with_water = {
                from: startPersonsWithWater,
                to: endPersonsWithWater,
            };

            if (item.children?.length) {
                mergeWaterSnapshots(item.children, startItems);
            }
        }
    };

    function reset() {
        nationStatus.value = null;
        error.value = null;
        metrics.value = [];
        selection.value = [];
        collapsedStatuses.value = {};
        from.value.setTime(new Date());
        to.value.setTime(new Date());
        loaded.value = {
            from: null,
            to: null,
        };

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
        filteredMetrics,
        hexagoneMetrics,
        metrics,
        evolution,
        collapsedStatuses,
        selection,
        showParametres,
        parametresDeVue,
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

            const refreshing = nationStatus.value === "loaded";
            nationStatus.value = refreshing ? "refresh" : "init";
            if (!refreshing) {
                hexagoneMetrics.value = {};
                metrics.value = [];
            }
            try {
                const [endMetrics, startMetrics] = await Promise.all([
                    getNationMetrics(from.value, to.value),
                    getNationMetrics(from.value, from.value),
                ]);
                mergeWaterSnapshots(endMetrics, startMetrics);
                metrics.value = endMetrics;
                nationStatus.value = "loaded";
                loaded.value.from = new Date(from.value);
                loaded.value.to = new Date(to.value);
                createHexagoneTileMetrics(
                    metrics.value.filter((m) => m.uid === "metropole")[0]
                );
                return metrics.value;
            } catch (e) {
                error.value =
                    e?.user_message || "Une erreur inconnue est survenue";
                nationStatus.value = null;
                return null;
            }
        },
        async fetchEvolution() {
            evolution.isLoading.value = true;
            evolution.data = {};
            try {
                evolution.data.value = await getNationMetricsEvolution(
                    evolution.from.value,
                    evolution.to.value
                );
                nationStatus.value = "loaded";

                evolution.isLoading.value = false;
                return evolution;
            } catch (e) {
                error.value =
                    e?.user_message || "Une erreur inconnue est survenue";
                nationStatus.value = null;
                evolution.isLoading.value = false;
                return null;
            }
        },
    };
});
