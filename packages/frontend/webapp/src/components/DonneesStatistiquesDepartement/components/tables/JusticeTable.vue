<template>
    <TemplateTable
        :columns="
            pick([
                'number_of_towns_with_owner_complaint',
                'number_of_towns_with_justice_procedure',
                'number_of_towns_with_police',
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
