<template>
    <tr>
        <th :class="variantClasses" v-for="(column, i) in row" :key="i">
            <rb-table-column :column="column"></rb-table-column>
        </th>
    </tr>
</template>
<script>
import RbTableColumn from "./RbTableColumn.vue";
export default {
    name: "RbTable",
    components: {
        RbTableColumn
    },
    props: {
        row: Object,
        variant: {
            type: String,
            default: "primary" // 'primary' for column caption row and 'secondary' for data row
        }
    },
    computed: {
        variantClasses() {
            return {
                primary: "bg-G200 border px-8 py-4",
                secondary: "bg-G100 border text-left px-8 py-4"
            }[this.variant];
        }
    }
};
</script>
