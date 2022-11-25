<template>
    <div>
        <div v-if="usePagination && nbPages > 1" class="mb-4 flex justify-end">
            <Pagination
                :currentPage="currentPage"
                :nbPages="nbPages"
                :onChangePage="onChangePage"
            />
        </div>
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

        <div v-if="usePagination && nbPages > 1" class="mt-4 flex justify-end">
            <Pagination
                :currentPage="currentPage"
                :nbPages="nbPages"
                :onChangePage="onChangePage"
            />
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, toRefs, defineEmits, computed, watch } from "vue";
import { Pagination } from "@resorptionbidonvilles/ui";

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
    usePagination: {
        type: Boolean,
        required: false,
        default: true,
    },
    itemsPerPage: {
        type: Number,
        required: false,
        default: 10,
    },
});
const { columns, data, usePagination, itemsPerPage } = toRefs(props);

const currentPage = ref(1);
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

const nbPages = computed(() => {
    return data.value.length > 0
        ? Math.ceil(data.value.length / itemsPerPage.value)
        : 0;
});

watch(usePagination, () => {
    this.currentPage = 1;
});
watch(itemsPerPage, () => {
    this.currentPage = 1;
});
watch(data, () => {
    this.currentPage = 1;
});

function onChangePage(page) {
    currentPage.value = page;
}
</script>

<style lang="scss" scoped>
.zebra tr:nth-child(even) {
    @apply bg-G200;
}
.zebra tr:nth-child(odd) {
    @apply bg-G100;
}
</style>
