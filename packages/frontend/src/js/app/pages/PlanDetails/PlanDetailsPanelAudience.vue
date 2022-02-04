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
        },
        audience() {
            if (!this.plan || this.plan.states.length === 0) {
                return null;
            }

            function sum(originalObj, additionalObj) {
                return {
                    total: originalObj.total + additionalObj.total,
                    families: originalObj.families + additionalObj.families,
                    women: originalObj.women + additionalObj.women,
                    minors: originalObj.minors + additionalObj.minors
                };
            }

            return this.plan.states.reduce(
                (acc, { audience }) => {
                    if (audience.in) {
                        acc.in = sum(acc.in, audience.in);
                    }

                    if (audience.out_positive) {
                        acc.out_positive = sum(
                            acc.out_positive,
                            audience.out_positive
                        );
                    }

                    if (audience.out_abandoned) {
                        acc.out_abandoned = sum(
                            acc.out_abandoned,
                            audience.out_abandoned
                        );
                    }

                    if (audience.out_excluded) {
                        acc.out_excluded = sum(
                            acc.out_excluded,
                            audience.out_excluded
                        );
                    }

                    return acc;
                },
                {
                    in: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_positive: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_abandoned: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_excluded: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    }
                }
            );
        }
    }
};
</script>
