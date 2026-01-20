import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { useEventBus } from "@common/helpers/event-bus";
import { useTownsStore } from "@/stores/towns.store";
import { usePoiStore } from "@/stores/poi.store";
import mapFilters from "@/utils/map_filters.js";
import filterShantytownsForMap from "@/utils/filterShantytownsForMap";

export const useMapStore = defineStore("map", () => {
    const filters = ref(
        mapFilters.value.order.reduce((acc, id) => {
            const { opened, options } = mapFilters.value.definition[id];
            acc[id] = {
                opened: opened === true,
                checked: options.reduce((oAcc, option) => {
                    if (option.checked === true) {
                        oAcc.push(option.value);
                    }

                    return oAcc;
                }, []),
            };
            return acc;
        }, {})
    );
    const filtersAreOpen = ref(true);
    const showAddresses = ref(false);
    const lastView = ref(null);
    const quickview = {
        town: ref(null),
        poi: ref(null),
    };

    const townsStore = useTownsStore();
    const filteredTowns = computed(() => {
        return filterShantytownsForMap(
            townsStore.towns,
            Object.keys(filters.value).reduce((acc, filterId) => {
                acc[filterId] = filters.value[filterId].checked;
                return acc;
            }, {})
        );
    });

    const poiStore = usePoiStore();
    const filteredPois = computed(() => {
        if (filters.value.poi.checked.length === 0) {
            return [];
        }

        return [...poiStore.pois];
    });

    function reset() {
        mapFilters.value.order.forEach((id) => {
            const { opened, options } = mapFilters.value.definition[id];
            const checked = options.reduce((acc, option) => {
                if (option.checked === true) {
                    acc.push(option.value);
                }

                return acc;
            }, []);

            filters.value[id].opened = opened;
            filters.value[id].checked = checked;
        }, {});
        filtersAreOpen.value = true;
        lastView.value = null;
        quickview.town.value = null;
        quickview.poi.value = null;
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        lastView,
        quickview,
        showAddresses,
        filters,
        filtersAreOpen,
        filteredTowns,
        filteredPois,
    };
});
