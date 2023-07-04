<template>
    <TemplateTable
        :columns="
            pick([
                'number_of_persons',
                'number_of_inhabitants_with_water',
                'number_of_inhabitants_with_electricity',
                'number_of_inhabitants_with_trash_evacuation',
                'number_of_inhabitants_with_fire_prevention',
                'number_of_inhabitants_with_toilets',
                'number_of_inhabitants_without_pest_animals',
                'number_of_inhabitants_with_heatwave',
            ])
        "
        :metrics="metrics"
    />
</template>

<script setup>
import { toRefs } from "vue";
import TemplateTable from "./TemplateTable.vue";
import pick from "../../utils/pick";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);
</script>
