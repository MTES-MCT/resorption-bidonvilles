<template>
    <tr class="bg-G100 text-right">
        <td class="text-left py-1">
            <CommuneBodyCell :data="data" :town="town" />
        </td>
        <td
            class="font-normal align-top py-1"
            v-for="(col, index) in columns"
            :key="index"
        >
            <component :is="col.bodyComponent" :data="data" :town="town" />
        </td>
    </tr>
</template>

<script setup>
import { toRefs } from "vue";
import CommuneBodyCell from "../cells/CommuneBody.vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
    town: {
        type: Object,
        required: true,
    },
});
const { data, columns, town } = toRefs(props);
</script>
