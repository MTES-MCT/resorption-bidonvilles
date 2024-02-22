<template>
    <div>
        <div v-if="usePagination && nbPages > 1" class="mb-4 flex justify-end">
            <Pagination
                :currentPage="currentPage"
                :nbPages="nbPages"
                @pagechange="onChangePage"
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
                        class="border-collapse text-center border-1 p-6 text-G700 italic"
                        :colspan="columns.length"
                    >
                        <slot name="empty">Aucune donnée à afficher</slot>
                    </td>
                </tr>
                <!-- if data provided -->
                <TableauLigne
                    v-else
                    v-for="(row, key) in pageContent"
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
                @pagechange="onChangePage"
                autoScrollFix
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
const pageContent = computed(() => {
    emit("datachange");

    if (usePagination.value === false) {
        return data.value;
    }

    return data.value.slice(
        (currentPage.value - 1) * itemsPerPage.value,
        currentPage.value * itemsPerPage.value
    );
});
const nbPages = computed(() => {
    return data.value.length > 0
        ? Math.ceil(data.value.length / itemsPerPage.value)
        : 0;
});

watch(usePagination, () => {
    currentPage.value = 1;
});
watch(itemsPerPage, () => {
    currentPage.value = 1;
});
watch(data, () => {
    currentPage.value = 1;
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
