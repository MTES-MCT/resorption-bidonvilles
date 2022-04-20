<template>
    <DetailsPanel>
        <template v-slot:title>Formation et emploi</template>
        <template v-slot:body>
            <p class="font-bold">
                Nombre de personnes inscrites ou suivies par...
            </p>
            <RbTable :columns="columns" :data="data1" />
            <p class="font-bold mt-4">
                Nombre de personnes ayant...
            </p>
            <RbTable :columns="columns" :data="data2" />
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
        data1() {
            return [
                {
                    label: "Pôle emploi",
                    ...this.getEntry("pole_emploi")
                },
                {
                    label: "(dont femmes)",
                    ...this.getEntry("pole_emploi_femmes")
                },
                {
                    label: "Mission locale",
                    ...this.getEntry("mission_locale")
                },
                {
                    label: "(dont femmes)",
                    ...this.getEntry("mission_locale_femmes")
                }
            ];
        },
        data2() {
            return [
                {
                    label: "Un contrat",
                    ...this.getEntry("contrats")
                },
                {
                    label: "(dont femmes)",
                    ...this.getEntry("contrats_femmes")
                },
                {
                    label: "Une formation",
                    ...this.getEntry("formations")
                },
                {
                    label: "(dont femmes)",
                    ...this.getEntry("formations_femmes")
                },
                {
                    label: "Un statut autoentrepreneur",
                    ...this.getEntry("autoentrepreneurs")
                },
                {
                    label: "(dont femmes)",
                    ...this.getEntry("autoentrepreneurs_femmes")
                },
                {
                    label: "l'ARE",
                    ...this.getEntry("are")
                },
                {
                    label: "(dont femmes)",
                    ...this.getEntry("are_femmes")
                }
            ];
        }
    },

    methods: {
        getEntry(entry) {
            return this.plan.states.map(state => {
                return state.formation[entry] === null
                    ? "NC"
                    : state.formation[entry];
            });
        }
    }
};
</script>
