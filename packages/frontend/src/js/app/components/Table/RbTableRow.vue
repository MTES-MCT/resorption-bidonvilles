<template>
    <tr>
        <th :class="variantClasses" v-for="(column, i) in row" :key="i">
            <rb-table-column :column="column" />
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
            default: "primary" // 'primary' for column titles row and 'secondary' for data row
        }
    },
    computed: {
        variantClasses() {
            return {
                primary:
                    "bg-G200 font-bold border-0 border-b-2 border-black px-4 py-2",
                secondary: "border-0 font-normal text-left px-4 py-2"
            }[this.variant];
        }
    }
};
</script>
