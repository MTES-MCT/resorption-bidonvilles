<template>
    <DetailsPanel>
        <template v-slot:title>Public</template>
        <template v-slot:body>
            <RbTable :columns="columns" :data="data" />
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import RbTable from "#app/components/Table/RbTable.vue";

export default {
    props: {
        plan: {
            type: Object
        },
        audience: {
            type: Object
        }
    },

    components: {
        DetailsPanel,
        RbTable
    },

    data() {
        return {
            entries: [
                { id: "in", label: "Entrées dans le dispositif" },
                {
                    id: "out_positive",
                    label:
                        "Sorties positivement fin accompagnement social et/ou prise en charge dans un autre dispositif"
                },
                { id: "out_excluded", label: "Exclusion du dispositif" },
                { id: "out_abandoned", label: "Abandon / départ volontaire" }
            ]
        };
    },

    computed: {
        columns() {
            return [
                { id: "label", label: "" },
                { id: "families", label: "Ménages" },
                { id: "total", label: "Personnes" },
                { id: "women", label: "dont femmes" },
                { id: "minors", label: "dont mineurs" }
            ];
        },
        data() {
            if (!this.audience) {
                return [];
            }

            return this.entries.map(({ id, label }) => {
                return {
                    label,
                    families: this.audience[id].families,
                    total: this.audience[id].total,
                    women: this.audience[id].women,
                    minors: this.audience[id].minors
                };
            });
        }
    }
};
</script>
