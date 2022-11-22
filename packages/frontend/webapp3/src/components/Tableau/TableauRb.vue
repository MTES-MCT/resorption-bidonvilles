<template>
    <div>
        <table class="zebra w-full">
            <!-- header rows and columns -->
            <thead>
                <TableauLigne :row="columnLabels" />
            </thead>

            <!-- data rows and columns -->
            <tbody>
                <!-- if no data provided -->
                <tr v-if="isEmpty">
                    <td
                        class="border-collapse text-center border-1 p-6 text-G600 italic"
                        :colspan="columns.length"
                    >
                        Aucune donnée à afficher
                    </td>
                </tr>
                <!-- if data provided -->
                <TableauLigne
                    v-else
                    v-for="(row, key) in data"
                    :columns="columnIds"
                    :row="row"
                    variant="secondary"
                    :key="row.id || key"
                >
                    <template v-slot:cell="slotProps">
                        <slot name="cell" v-bind="{ ...slotProps, row: key }">
                            <TableauCellule :content="slotProps.content" />
                        </slot>
                    </template>
                </TableauLigne>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineProps, toRefs, defineEmits, computed } from "vue";

import TableauLigne from "./TableauLigne.vue";
import TableauCellule from "./TableauCellule.vue";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        required: false,
        default() {
            return [];
        },
    },
});
const { columns, data } = toRefs(props);

const emit = defineEmits(["datachange"]);

const columnIds = computed(() => {
    return columns.value.map(({ id }) => id);
});
const columnLabels = computed(() => {
    return columns.value.map(({ label }) => label);
});
const isEmpty = computed(() => {
    emit("datachange");
    return data.value.length < 1;
});
</script>

<style lang="scss" scoped>
.zebra tr:nth-child(even) {
    @apply bg-G200;
}
.zebra tr:nth-child(odd) {
    @apply bg-G100;
}
</style>
