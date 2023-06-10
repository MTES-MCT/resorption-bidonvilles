<template>
    <TemplateTable :columns="columns" :metrics="enrichedMetrics" />
</template>

<script setup>
import { computed, toRefs } from "vue";

import TemplateTable from "./TemplateTable.vue";
import TownsBody from "../cells/TownsBody.vue";
import TownsHead from "../cells/TownsHead.vue";
import PersonsBody from "../cells/PersonsBody.vue";
import PersonsHead from "../cells/PersonsHead.vue";
import HouseholdsBody from "../cells/HouseholdsBody.vue";
import HouseholdsHead from "../cells/HouseholdsHead.vue";
import MinorsBody from "../cells/MinorsBody.vue";
import MinorsHead from "../cells/MinorsHead.vue";
import OriginsBody from "../cells/OriginsBody.vue";
import OriginsHead from "../cells/OriginsHead.vue";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);

const columns = [
    {
        uid: "number_of_tows",
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
        uid: "number_of_households",
        icon: "people-group",
        title: "Nombre de ménages",
        headComponent: HouseholdsHead,
        bodyComponent: HouseholdsBody,
    },
    {
        uid: "number_of_minors",
        icon: "child",
        title: "Nombre de mineurs",
        headComponent: MinorsHead,
        bodyComponent: MinorsBody,
    },
    {
        uid: "origins",
        icon: "earth-europe",
        title: "Origines",
        headComponent: OriginsHead,
        bodyComponent: OriginsBody,
    },
];

const enrichedMetrics = computed(() => {
    return metrics.value.cities.map((city) => {
        const s = {
            number_of_towns: city.towns.length,
            number_of_persons: null,
            number_of_households: null,
            number_of_minors: null,
        };

        return {
            ...city,
            summary: city.towns.reduce((acc, town) => {
                if (Number.isFinite(town.number_of_persons)) {
                    s.number_of_persons += town.number_of_persons;
                }
                if (Number.isFinite(town.number_of_households)) {
                    s.number_of_households += town.number_of_households;
                }
                if (Number.isFinite(town.number_of_minors)) {
                    s.number_of_minors += town.number_of_minors;
                }

                return acc;
            }, s),
        };
    });
});
</script>
