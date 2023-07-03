<template>
    <tr class="text-right data-table-header">
        <th class="text-left font-normal py-1">
            <CommuneHeadCell :data="data" />
        </th>
        <th
            class="font-normal align-top max-w-4 py-1"
            v-for="col in columns"
            :key="col.uid"
        >
            <component :is="col.headComponent" :data="data" />
        </th>
        <th></th>
    </tr>
</template>

<script setup>
import { toRefs } from "vue";
import CommuneHeadCell from "../cells/Commune/CommuneHead.vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
});
const { data, columns } = toRefs(props);
</script>
