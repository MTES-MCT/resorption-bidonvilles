<template>
    <div>
        <rb-table-caption
            v-if="dataTable.caption"
            :caption="dataTable.caption"
        ></rb-table-caption>
        <table>
            <!-- header rows and columns -->
            <thead>
                <rb-table-row :row="dataTable.columns" variant="primary" />
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
                    :variant="secondary"
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
