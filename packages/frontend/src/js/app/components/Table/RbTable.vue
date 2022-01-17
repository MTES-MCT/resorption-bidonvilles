<template>
    <div>
        <rb-table-caption
            v-if="dataTable.caption"
            :caption="dataTable.caption"
        ></rb-table-caption>
        <table class="zebra">
            <!-- header rows and columns -->
            <thead>
                <rb-table-row :row="dataTable.columns" />
            </thead>
            <!-- data rows and columns -->
            <tbody>
                <!-- if no data provided -->
                <tr v-if="isEmpty">
                    <td
                        class="border-collapse border"
                        :colspan="dataTable.columns.length"
                    >
                        {{ dataTable.emptyTableText }}
                    </td>
                </tr>
                <!-- if data provided -->
                <rb-table-row
                    v-else
                    v-for="(data, key) in dataTable.datas"
                    :key="key"
                    :row="data"
                    variant="secondary"
                />
            </tbody>
        </table>
    </div>
</template>
<script>
import RbTableRow from "./RbTableRow.vue";
import RbTableCaption from "./RbTableCaption.vue";
export default {
    name: "RbTable",
    components: {
        RbTableRow,
        RbTableCaption
    },
    props: {
        dataTable: Object
    },
    computed: {
        isEmpty() {
            return this.dataTable.datas.length < 1;
        }
    }
};
</script>
<style lang="scss" scoped>
.zebra tr:nth-child(even) {
    @apply bg-G200;
}
.zebra tr:nth-child(odd) {
    @apply bg-G100;
}
</style>
