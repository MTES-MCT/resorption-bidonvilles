<template>
    <TemplateTable
        :columns="
            pick([
                'number_of_complaints',
                'number_of_justice_procedure',
                'number_of_police',
            ])
        "
        :metrics="metrics"
    />
</template>

<script setup>
import { toRefs } from "vue";
import pick from "../../columns/utils/pick";
import TemplateTable from "./TemplateTable.vue";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);
</script>
