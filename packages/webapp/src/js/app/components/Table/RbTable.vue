<template>
    <div>
        <RbTableCaption v-if="caption" :caption="caption"></RbTableCaption>

        <div
            v-if="usePagination && this.nbPages > 1"
            class="mb-4 flex justify-end"
        >
            <Pagination
                :currentPage="currentPage"
                :nbPages="nbPages"
                :onChangePage="onChangePage"
            />
        </div>

        <table class="zebra w-full">
            <!-- header rows and columns -->
            <thead>
                <RbTableRow :row="columnLabels" />
            </thead>

            <!-- data rows and columns -->
            <tbody>
                <!-- if no data provided -->
                <tr v-if="isEmpty">
                    <td
                        class="border-collapse text-center border p-6 text-G600 italic"
                        :colspan="columns.length"
                    >
                        {{ emptyTableText }}
                    </td>
                </tr>
                <!-- if data provided -->
                <RbTableRow
                    v-else
                    v-for="(row, key) in pageContent"
                    :columns="columnIds"
                    :row="row"
                    variant="secondary"
                    :key="getKey(row, key)"
                >
                    <template v-slot:cell="slotProps">
                        <slot name="cell" v-bind="{ ...slotProps, row: key }">
                            <RbTableCell :content="slotProps.content" />
                        </slot>
                    </template>
                </RbTableRow>
            </tbody>
        </table>

        <div
            v-if="usePagination && this.nbPages > 1"
            class="mt-4 flex justify-end"
        >
            <Pagination
                :currentPage="currentPage"
                :nbPages="nbPages"
                :onChangePage="onChangePage"
            />
        </div>
    </div>
</template>

<script>
import RbTableRow from "./RbTableRow.vue";
import RbTableCell from "./RbTableCell.vue";
import RbTableCaption from "./RbTableCaption.vue";

export default {
    components: {
        RbTableRow,
        RbTableCell,
        RbTableCaption
    },
    props: {
        caption: {
            type: String,
            required: false
        },
        emptyTableText: {
            type: String,
            required: false,
            default: "Aucune donnée à afficher"
        },
        columns: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },
        getKey: {
            type: Function,
            required: false,
            default(row, key) {
                return row.id || key;
            }
        },
        usePagination: {
            type: Boolean,
            required: false,
            default: true
        },
        itemsPerPage: {
            type: Number,
            required: false,
            default: 10
        }
    },
    data() {
        return {
            currentPage: 1
        };
    },
    watch: {
        usePagination() {
            this.currentPage = 1;
        },
        itemsPerPage() {
            this.currentPage = 1;
        },
        data() {
            this.currentPage = 1;
        }
    },
    computed: {
        columnIds() {
            return this.columns.map(({ id }) => id);
        },
        columnLabels() {
            return this.columns.map(({ label }) => label);
        },
        isEmpty() {
            return this.data.length < 1;
        },
        pageContent() {
            if (this.usePagination === false) {
                return this.data;
            }

            return this.data.slice(
                (this.currentPage - 1) * this.itemsPerPage,
                this.currentPage * this.itemsPerPage
            );
        },
        nbPages() {
            return this.data.length > 0
                ? Math.ceil(this.data.length / this.itemsPerPage)
                : 0;
        }
    },
    methods: {
        onChangePage(page) {
            this.currentPage = page;
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
