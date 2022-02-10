<template>
    <DetailsPanel>
        <template v-slot:title>Santé</template>
        <template v-slot:body>
            <p class="font-bold">Nombre de personnes avec...</p>
            <RbTable :columns="columns" :data="data1" />
            <p class="font-bold mt-4">
                Nombre de personnes ayant fait l'objet d'au moins...
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
                    label: "une couverture AME valide",
                    ...this.getEntry("ame_valide")
                },
                {
                    label: "une couverture PUMA valide",
                    ...this.getEntry("puma_valide")
                },
                {
                    label: "une demande AME en cours",
                    ...this.getEntry("ame_en_cours")
                },
                {
                    label: "une demande PUMA en cours",
                    ...this.getEntry("puma_en_cours")
                }
            ];
        },
        data2() {
            return [
                {
                    label: "une orientation vers une structure de santé",
                    ...this.getEntry("orientation")
                },
                {
                    label:
                        "un accompagnement physique vers une structure de santé",
                    ...this.getEntry("accompagnement")
                }
            ];
        }
    },

    methods: {
        getEntry(entry) {
            return this.plan.states.map(state => {
                return state.sante[entry] === null ? "NC" : state.sante[entry];
            });
        }
    }
};
</script>
