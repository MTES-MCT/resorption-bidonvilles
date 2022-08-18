<template>
    <DetailsPanel>
        <template v-slot:title>Evacuation du site</template>
        <template v-slot:body>
            <DetailsPanelSection>
                <div class="grid grid-cols-2">
                    <div class="font-bold">
                        Date de l'évacuation
                    </div>

                    <div class="-ml-5">
                        {{ closedAt }}
                    </div>
                </div>
            </DetailsPanelSection>
            <DetailsPanelSection>
                <div class="grid grid-cols-2">
                    <div class="font-bold">
                        Sité résorbé
                    </div>

                    <div class="-ml-5">
                        {{ closedWithSolutions }}
                    </div>
                </div>
            </DetailsPanelSection>
            <DetailsPanelSection>
                <div class="grid grid-cols-2">
                    <div class="font-bold">
                        Cause de la disparition
                    </div>

                    <div class="-ml-5">
                        {{ town.statusDetails }}
                    </div>
                </div>
            </DetailsPanelSection>
            <div class="border-t-1 border-G200 py-4">
                <table
                    class="table-fixed text-center mx-12"
                    v-if="town.closingSolutions.length > 0"
                >
                    <thead>
                        <tr>
                            <td class="border-b-1 font-bold">
                                Orientations des ménages
                            </td>
                            <td class="w-24 py-2 border-b-1 font-bold">
                                Ménages
                            </td>
                            <td class="w-24 py-2 border-b-1 font-bold">
                                Personnes
                            </td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in town.closingSolutions"
                            :key="item.id"
                        >
                            <td class="text-left pr-4 border-b-1 border-r-1">
                                {{ closingSolutions[item.id] }}
                            </td>
                            <td class="py-1 border-b-1 border-r-1">
                                {{ `${item.householdsAffected || "-"}` }}
                            </td>
                            <td class="py-1 border-b-1">
                                {{ `${item.peopleAffected || "-"}` }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else>
                    Aucune information disponible sur les orientations des
                    ménages
                </div>
            </div>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";

export default {
    data() {
        const {
            closing_solutions: closingSolutions
        } = this.$store.state.config.configuration;
        return {
            closingSolutions: closingSolutions.reduce((acc, item) => {
                acc[item.id] = item.label;
                return acc;
            }, {})
        };
    },
    props: {
        town: {
            type: Object
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    },
    components: { DetailsPanel, DetailsPanelSection },
    computed: {
        closedAt() {
            return this.formatDate(this.town.closedAt);
        },
        closedWithSolutions() {
            return this.town.closedWithSolutions === "yes" ? "Oui" : "Non";
        }
    }
};
</script>
