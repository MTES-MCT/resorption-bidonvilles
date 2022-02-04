<template>
    <DetailsPanel>
        <template v-slot:title>Droits communs et ressources</template>
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
                { id: "label", label: "Nombre de personnes ayant" },
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
                    label: "une domiciliation",
                    ...this.plan.states.map(state => {
                        return state.droit_commun.domiciliation === null
                            ? "NC"
                            : state.droit_commun.domiciliation;
                    })
                },
                {
                    label: "des droits CAF ouverts",
                    ...this.plan.states.map(state => {
                        return state.droit_commun.droits_caf === null
                            ? "NC"
                            : state.droit_commun.droits_caf;
                    })
                },
                {
                    label: "un emploi stable / ressources suffisantes",
                    ...this.plan.states.map(state => {
                        return state.droit_commun.emploi_stable === null
                            ? "NC"
                            : state.droit_commun.emploi_stable;
                    })
                }
            ];
        }
    }
};
</script>
