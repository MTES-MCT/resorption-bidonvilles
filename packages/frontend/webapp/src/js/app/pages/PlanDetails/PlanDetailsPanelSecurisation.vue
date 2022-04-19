<template>
    <DetailsPanel>
        <template v-slot:title>Stabilisation et sécurisation du site</template>
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
                    label: "Nombre d'accès réguliers à l'eau potable",
                    ...this.getEntry("points_eau")
                },
                {
                    label: "Nombre de sanitaires",
                    ...this.getEntry("wc")
                },
                {
                    label: "Nombre d'accès réguliers à l'électricité",
                    ...this.getEntry("electricite")
                },
                {
                    label:
                        "Nombre de bennes disponibles pour le ramassage des déchets du site",
                    ...this.getEntry("nombre_bennes")
                }
            ];
        }
    },

    methods: {
        getEntry(entry) {
            return this.plan.states.map(state => {
                return state.securisation[entry] === null
                    ? "NC"
                    : state.securisation[entry];
            });
        }
    }
};
</script>
