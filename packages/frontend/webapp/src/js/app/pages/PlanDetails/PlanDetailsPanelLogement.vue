<template>
    <DetailsPanel>
        <template v-slot:title>Logement</template>
        <template v-slot:body>
            <div v-for="(field, index) in housingFields" :key="field.name">
                <p class="font-bold" :class="{ 'mt-4': index > 0 }">
                    {{ field.label }}
                </p>
                <RbTable :columns="columns" :data="data[field.name]" />
            </div>
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
            housingFields: [
                { name: "siao", label: "Demandes SIAO" },
                {
                    name: "logement_social",
                    label: "Demandes de logement social"
                },
                { name: "dalo", label: "Demandes DALO" },
                {
                    name: "accompagnes",
                    label: "Accès à un logement accompagné / adapté"
                },
                {
                    name: "non_accompagnes",
                    label: "Accès à un logement sans accompagnement"
                },
                { name: "heberges", label: "Hébergements" }
            ]
        };
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
            return this.housingFields.reduce((acc, { name }) => {
                return {
                    ...acc,
                    [name]: [
                        {
                            label: "Nombre de personnes",
                            ...this.getEntry(name, "people")
                        },
                        {
                            label: "Nombre de ménages",
                            ...this.getEntry(name, "families")
                        }
                    ]
                };
            }, {});
        }
    },

    methods: {
        getEntry(field, entry) {
            return this.plan.states.map(state => {
                return state.logement[field][entry] === null
                    ? "NC"
                    : state.logement[field][entry];
            });
        }
    }
};
</script>
