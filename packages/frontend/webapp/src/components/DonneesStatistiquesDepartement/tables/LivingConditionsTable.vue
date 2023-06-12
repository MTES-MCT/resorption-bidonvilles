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
import ElectricityBody from "../cells/ElectricityBody.vue";
import ElectricityHead from "../cells/ElectricityHead.vue";
import TrashBody from "../cells/TrashBody.vue";
import TrashHead from "../cells/TrashHead.vue";
import FireBody from "../cells/FireBody.vue";
import FireHead from "../cells/FireHead.vue";
import ToiletsBody from "../cells/ToiletsBody.vue";
import ToiletsHead from "../cells/ToiletsHead.vue";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);

const columns = [
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
    {
        uid: "number_of_towns_with_electricity",
        icon: "bolt",
        title: "Nombre de sites avec accès à l'électricité",
        headComponent: ElectricityHead,
        bodyComponent: ElectricityBody,
    },
    {
        uid: "number_of_towns_with_trash_evacuation",
        icon: "trash-alt",
        title: "Nombre de sites avec évacuation des déchets",
        headComponent: TrashHead,
        bodyComponent: TrashBody,
    },
    {
        uid: "number_of_towns_with_fire_prevention",
        icon: "fire-extinguisher",
        title: "Nombre de sites avec prévention incendie",
        headComponent: FireHead,
        bodyComponent: FireBody,
    },
    {
        uid: "number_of_towns_with_toilets",
        icon: "toilet",
        title: "Nombre de sites avec accès aux toilettes",
        headComponent: ToiletsHead,
        bodyComponent: ToiletsBody,
    },
];

const enrichedMetrics = computed(() => {
    return metrics.value.cities.map((city) => {
        const summary = {
            number_of_persons: null,
            number_of_towns_with_water: 0,
            percentage_of_towns_with_water: 0.0,
            number_of_towns_with_electricity: 0,
            percentage_of_towns_with_electricity: 0.0,
            number_of_towns_with_trash_evacuation: 0,
            percentage_of_towns_with_trash_evacuation: 0.0,
            number_of_towns_with_fire_prevention: 0,
            percentage_of_towns_with_fire_prevention: 0.0,
            number_of_towns_with_toilets: 0,
            percentage_of_towns_with_toilets: 0.0,
        };

        const m = {
            ...city,
            summary: city.towns.reduce((acc, town) => {
                if (Number.isFinite(town.number_of_persons)) {
                    acc.number_of_persons += town.number_of_persons;
                }

                acc.number_of_towns_with_water += town.access_to_water ? 1 : 0;
                acc.number_of_towns_with_electricity +=
                    town.access_to_electricity ? 1 : 0;
                acc.number_of_towns_with_trash_evacuation +=
                    town.trash_evacuation ? 1 : 0;
                acc.number_of_towns_with_fire_prevention += town.fire_prevention
                    ? 1
                    : 0;
                acc.number_of_towns_with_toilets += town.toilets ? 1 : 0;

                return acc;
            }, summary),
        };

        Object.keys(summary)
            .filter((key) => key.startsWith("percentage"))
            .forEach((key) => {
                m.summary[key] =
                    Math.round(
                        (m.summary[key.replace("percentage", "number")] /
                            m.towns.length) *
                            1000
                    ) / 10;
            });

        return m;
    });
});
</script>
