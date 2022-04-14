<template>
    <tr>
        <th :class="variantClasses" v-for="(column, i) in data" :key="i">
            <slot name="cell" :content="column" :column="columns && columns[i]">
                <RbTableCell :content="column" />
            </slot>
        </th>
    </tr>
</template>
<script>
import RbTableCell from "./RbTableCell.vue";

export default {
    components: {
        RbTableCell
    },
    props: {
        row: {
            type: [Array, Object],
            required: true
        },
        columns: {
            type: Array,
            required: false
        },
        variant: {
            type: String,
            required: false,
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
        },
        data() {
            if (Array.isArray(this.row)) {
                return this.row;
            }

            if (!Array.isArray(this.columns)) {
                throw new Error(
                    "You must specify the columns or give an array of data"
                );
            }

            return this.columns.map(id => this.row[id]);
        }
    }
};
</script>
