<template>
    <TemplateTable
        :columns="
            pick([
                'number_of_towns',
                'number_of_minors',
                'number_of_schooled_minors',
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
