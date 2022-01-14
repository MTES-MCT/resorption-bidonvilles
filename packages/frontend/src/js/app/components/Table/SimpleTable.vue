<template>
    <div>
        <table>
            <!-- header columns -->
            <thead>
                <tr>
                    <th
                        class="bg-G100 border text-left px-8 py-4"
                        v-for="(column, i) in dataTable.columns"
                        :key="i"
                    >
                        <SimpleRow>{{ column }}</SimpleRow>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isEmpty">
                    <td
                        class="border-collapse border"
                        :colspan="dataTable.columns.length"
                    >
                        {{ dataTable.emptyTableText }}
                    </td>
                </tr>
                <tr v-else v-for="(data, key) in dataTable.datas" :key="key">
                    <td
                        class="bg-G200 border px-8 py-4"
                        v-for="(value, key) in data"
                        :key="key"
                    >
                        <span>{{ value }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import SimpleRow from "./SimpleRow.vue";
export default {
    name: "SimpleTable",
    components: {
        SimpleRow
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
