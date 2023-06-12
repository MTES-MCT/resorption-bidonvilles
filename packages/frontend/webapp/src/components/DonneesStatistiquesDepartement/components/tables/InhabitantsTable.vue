<template>
    <TemplateTable
        :columns="
            pick([
                'number_of_towns',
                'number_of_persons',
                'number_of_households',
                'number_of_minors',
                'origins',
            ])
        "
        :metrics="metrics"
    />
</template>

<script setup>
import { toRefs } from "vue";
import TemplateTable from "./TemplateTable.vue";
import pick from "../../columns/utils/pick";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);
</script>
