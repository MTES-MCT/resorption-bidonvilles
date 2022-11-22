<template>
    <tr>
        <th :class="variantClasses" v-for="(column, i) in data" :key="i">
            <slot name="cell" :content="column" :column="columns && columns[i]">
                <TableauCellule :content="column" />
            </slot>
        </th>
    </tr>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import TableauCellule from "./TableauCellule.vue";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    row: {
        type: [Array, Object],
        required: true,
    },

    variant: {
        type: String,
        required: false,
        default: "primary", // 'primary' for column titles row and 'secondary' for data row
    },
});
const { columns, row, variant } = toRefs(props);

const variantClasses = computed(() => {
    return {
        primary: "bg-G200 font-bold border-0 border-b-2 border-black px-4 py-2",
        secondary: "border-0 font-normal text-left px-4 py-2",
    }[variant.value];
});

const data = computed(() => {
    if (Array.isArray(row.value)) {
        return row.value;
    }

    if (!Array.isArray(columns.value)) {
        throw new Error(
            "You must specify the columns or give an array of data"
        );
    }

    return columns.value.map((id) => row.value[id]);
});
</script>
