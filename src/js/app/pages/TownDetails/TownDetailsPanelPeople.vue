<template>
    <TownDetailsPanel>
        <template v-slot:title>Habitants</template>
        <template v-slot:body>
            <TownDetailsPanelSection>
                <div class="flex items-center mb-4">
                    <div
                        class="text-display-sm mr-4"
                        data-cy-data="population_total"
                    >
                        {{ town.populationTotal || 0 }} personnes
                    </div>
                    <div
                        class="text-display-sm mr-4"
                        data-cy-data="population_couples"
                    >
                        {{ town.populationCouples || 0 }} ménages
                    </div>
                    <div
                        class="text-display-sm"
                        data-cy-data="population_minors"
                    >
                        {{ town.populationMinors || 0 }} mineurs
                    </div>
                </div>
                <div class="flex items-center mb-4">
                    <div class="mr-4" data-cy-data="population_minors_0_3">
                        <span class="text-display-xs">0 - 3 ans :</span><br />{{
                            populationMinors0To3
                        }}
                    </div>
                    <div class="mr-4" data-cy-data="population_minors_3_6">
                        <span class="text-display-xs">3 - 6 ans :</span><br />{{
                            populationMinors3To6
                        }}
                    </div>
                    <div class="mr-4" data-cy-data="population_minors_6_12">
                        <span class="text-display-xs">6 - 12 ans :</span
                        ><br />{{ populationMinors6To12 }}
                    </div>
                    <div class="mr-4" data-cy-data="population_minors_12_16">
                        <span class="text-display-xs">12 - 16 ans :</span
                        ><br />{{ populationMinors12To16 }}
                    </div>
                    <div class="mr-4" data-cy-data="population_minors_16_18">
                        <span class="text-display-xs">16 - 18 ans :</span
                        ><br />{{ populationMinors16To18 }}
                    </div>
                </div>
                <div>
                    <div class="font-bold">Origine</div>
                    <div data-cy-data="social_origins">
                        <div
                            v-if="!town.socialOrigins.length"
                            class="text-G600"
                        >
                            inconnue
                        </div>
                        <div
                            class="flex items-center"
                            v-else
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
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="w-96">
                        <div class="font-bold">Diagnostic social</div>
                        <div data-cy-data="census_status">
                            {{ socialDiagnostic }}
                        </div>
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
                return { id: 1, label: origin.label, img: flagFR };
            }

            if (origin.id === 2) {
                return { id: 2, label: origin.label, img: flagEU };
            }

            if (origin.id === 3) {
                return {
                    id: 3,
                    label: origin.label,
                    img: flagExtraCommunautaires
                };
            }

            return origin;
        },
        intToStr(int) {
            if (int === undefined || int === null) {
                return "NC";
            }

            return int;
        }
    },
    computed: {
        socialDiagnostic() {
            if (this.town.censusStatus === "done") {
                return `Réalisé le ${this.formatDate(
                    this.town.censusConductedAt,
                    "d/m/y"
                )} par ${this.town.censusConductedBy}`;
            }

            if (this.town.censusStatus === "scheduled") {
                return `Prévu le ${this.formatDate(
                    this.town.censusConductedAt,
                    "d/m/y"
                )} par ${this.town.censusConductedBy}`;
            }

            if (this.town.censusStatus === "none") {
                return "Non réalisé";
            }

            return "Non communiqué";
        },
        populationMinors0To3() {
            return this.intToStr(this.town.populationMinors0To3);
        },
        populationMinors3To6() {
            return this.intToStr(this.town.populationMinors3To6);
        },
        populationMinors6To12() {
            return this.intToStr(this.town.populationMinors6To12);
        },
        populationMinors12To16() {
            return this.intToStr(this.town.populationMinors12To16);
        },
        populationMinors16To18() {
            return this.intToStr(this.town.populationMinors16To18);
        }
    }
};
</script>
