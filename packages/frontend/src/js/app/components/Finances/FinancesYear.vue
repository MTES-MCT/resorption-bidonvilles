<template>
    <div>
        <RbTable :columns="columns" :data="rows">
            <template v-slot:cell="{ column, content }">
                <span v-if="column === 'type'">{{ content.name }}</span>
                <span v-else-if="column === 'amount'"
                    >{{ content }} &euro;<br /><span class="text-gray-500"
                        >soit {{ Math.round((content / total) * 100) }}%</span
                    ></span
                >
                <span v-else-if="column === 'details'">{{ content }}</span>
                <span v-else-if="column === 'realAmount'">
                    <span v-if="content !== null">{{ content }} &euro;</span>
                    <span v-else>N/R</span>
                </span>
            </template>
        </RbTable>
    </div>
</template>

<script>
import RbTable from "#app/components/Table/RbTable.vue";

export default {
    props: {
        rows: {
            type: Array,
            required: true
        }
    },

    components: {
        RbTable
    },

    computed: {
        columns() {
            return [
                { id: "type", label: "Type de financements" },
                { id: "amount", label: "Montants prévus" },
                { id: "details", label: "Précision" },
                { id: "realAmount", label: "Dépenses exécutées" }
            ];
        },
        total() {
            return this.rows.reduce((sum, { amount }) => sum + amount, 0);
        }
    }
};
</script>
