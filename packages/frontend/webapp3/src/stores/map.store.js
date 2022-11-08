import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { useEventBus } from "@/helpers/event-bus";
import { useTownsStore } from "@/stores/towns.store";
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
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        filters,
        filteredTowns,
    };
});
