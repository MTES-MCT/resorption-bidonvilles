<template>
    <TownDetailsPanel>
        <template v-slot:title>Habitants</template>
        <template v-slot:body>
            <TownDetailsPanelSection>
                <div class="flex items-center">
                    <div class="text-display-sm mr-4">
                        {{ town.populationTotal || 0 }} personnes
                    </div>
                    <div class="text-display-sm mr-4">
                        {{ town.populationCouples || 0 }} ménages
                    </div>
                    <div class="text-display-sm">
                        {{ town.populationMinors || 0 }} mineurs
                    </div>
                </div>
                <div>
                    <div>Origine</div>
                    <div
                        class="mt-2 text-display-sm"
                        v-for="origin in town.socialOrigins"
                        :key="origin.id"
                    >
                        {{ origin.label }}
                    </div>
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-bold">Diagnostic social</div>
                        <div>{{ socialDiagnostic }}</div>
                    </div>
                    <div>
                        Un diagnostic social vise à identifier les situations et
                        besoins des familles et personnes, de repérer le
                        contexte territorial et les acteurs en présence.
                    </div>
                </div>
            </TownDetailsPanelSection>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import TownDetailsPanelSection from "./ui/TownDetailsPanelSection.vue";

export default {
    props: {
        town: {
            type: Object
        }
    },
    components: { TownDetailsPanel, TownDetailsPanelSection },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    },
    computed: {
        socialDiagnostic() {
            if (this.town.censusStatus === "done") {
                return `Réalisé le ${this.formatDate(
                    this.town.censusConductedAt,
                    "y/m/d"
                )} par ${this.town.censusConductedBy}`;
            }

            return "Non réalisé";
        }
    }
};
</script>
