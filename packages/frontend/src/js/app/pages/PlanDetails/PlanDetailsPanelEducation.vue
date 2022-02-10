<template>
    <DetailsPanel>
        <template v-slot:title>Éducation et scolarisation</template>
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

    computed: {
        columns() {
            return [
                { id: "label", label: "" },
                ...this.plan.states.map((state, index) => {
                    return {
                        id: index,
                        label: App.formatDate(
                            new Date(state.date).getTime() / 1000,
                            "d B y"
                        )
                    };
                })
            ];
        },
        data() {
            return [
                {
                    label:
                        "Mineurs en âge d'être scolarisé ou suivant une formation",
                    ...this.getEntry("scolarisables")
                },
                {
                    label:
                        "Mineurs bénéficiant d'une action de médiation (3 - 18 ans)",
                    ...this.getEntry("en_mediation")
                },
                {
                    label: "Scolarisés en maternelle",
                    ...this.getEntry("maternelles")
                },
                {
                    label: "Scolarisés en élémentaire",
                    ...this.getEntry("elementaires")
                },
                {
                    label: "Scolarisés en collège",
                    ...this.getEntry("colleges")
                },
                {
                    label: "Scolarisés au Lycée - formation professionnelle",
                    ...this.getEntry("lycees")
                }
            ];
        }
    },

    methods: {
        getEntry(entry) {
            return this.plan.states.map(state => {
                return state.education[entry] === null
                    ? "NC"
                    : state.education[entry];
            });
        }
    }
};
</script>
