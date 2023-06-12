<template>
    <tr class="text-right" :class="even ? 'bg-G100' : 'bg-G200'">
        <td class="text-left py-1">
            <CommuneBodyCell :data="data" :town="town" />
        </td>
        <td
            v-for="col in columns"
            class="font-normal align-top py-1"
            :key="col.uid"
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
    even: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { data, columns, town, even } = toRefs(props);
</script>
