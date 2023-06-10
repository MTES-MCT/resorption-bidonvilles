<template>
    <TemplateTable :columns="columns" :metrics="enrichedMetrics" />
</template>

<script setup>
import { computed, toRefs } from "vue";

import TemplateTable from "./TemplateTable.vue";
import PersonsBody from "../cells/PersonsBody.vue";
import PersonsHead from "../cells/PersonsHead.vue";
import WaterBody from "../cells/WaterBody.vue";
import WaterHead from "../cells/WaterHead.vue";
import TownsBody from "../cells/TownsBody.vue";
import TownsHead from "../cells/TownsHead.vue";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);

const columns = [
    {
        uid: "number_of_towns",
        icon: "map-pin",
        title: "Nombre de sites",
        headComponent: TownsHead,
        bodyComponent: TownsBody,
    },
    {
        uid: "number_of_persons",
        icon: "person",
        title: "Nombre de personnes",
        headComponent: PersonsHead,
        bodyComponent: PersonsBody,
    },
    {
        uid: "number_of_towns_with_water",
        icon: "faucet-drip",
        title: "Nombre de sites avec accès à l'eau",
        headComponent: WaterHead,
        bodyComponent: WaterBody,
    },
];

const enrichedMetrics = computed(() => {
    return metrics.value.cities.map((city) => {
        const s = {
            number_of_towns: city.towns.length,
            number_of_persons: null,
            number_of_towns_with_water: 0,
            percentage_of_towns_with_water: 0.0,
        };

        return {
            ...city,
            summary: city.towns.reduce((acc, town) => {
                if (Number.isFinite(town.number_of_persons)) {
                    s.number_of_persons += town.number_of_persons;
                }
                s.number_of_towns_with_water += town.access_to_water ? 1 : 0;
                s.percentage_of_towns_with_water =
                    Math.round(
                        (s.number_of_towns_with_water / s.number_of_towns) *
                            1000
                    ) / 10;

                return acc;
            }, s),
        };
    });
});
</script>
