<template>
    <TownDetailsPanel>
        <template v-slot:title>Habitants</template>
        <template v-slot:body>
            <TownDetailsPanelSection>
                <div class="flex items-center mb-4">
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
                    <div class="font-bold">Origine</div>
                    <div
                        class="flex items-center"
                        v-for="origin in town.socialOrigins"
                        :key="origin.id"
                    >
                        <img
                            :src="socialOrigin(origin).img"
                            class=" w-8 mr-2"
                        />
                        <span class="text-display-sm">{{
                            socialOrigin(origin).label
                        }}</span>
                    </div>
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="w-96">
                        <div class="font-bold">Diagnostic social</div>
                        <div>{{ socialDiagnostic }}</div>
                    </div>
                    <div class="italic">
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
import flagFR from "#app/pages/TownsList/assets/fr.png";
import flagEU from "#app/pages/TownsList/assets/eu.png";
import flagExtraCommunautaires from "#app/pages/TownsList/assets/extra-communautaires.png";

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
        },
        socialOrigin(origin) {
            if (origin.id === 1) {
                return { id: 1, label: "Français", img: flagFR };
            }

            if (origin.id === 2) {
                return { id: 2, label: "Européens", img: flagEU };
            }

            if (origin.id === 3) {
                return {
                    id: 3,
                    label: "Extra-communautaires",
                    img: flagExtraCommunautaires
                };
            }

            return origin;
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
