<template>
    <TemplateTable
        :columns="
            pick([
                'number_of_towns',
                'number_of_persons',
                'number_of_households',
                'number_of_minors',
                'origins_european',
                'origins_extra',
                'origins_french',
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
