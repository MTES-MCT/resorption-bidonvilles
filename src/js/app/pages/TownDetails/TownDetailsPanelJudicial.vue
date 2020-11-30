<template>
    <TownDetailsPanel>
        <template v-slot:title>Procédures judiciaires</template>
        <template v-slot:body>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="font-bold">
                        Dépôt de plainte du propriétaire
                    </div>
                    <div>{{ town.ownerComplaint ? "oui" : "non" }}</div>
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="font-bold">
                        Existence d’une procédure judiciaire
                    </div>
                    <div>{{ town.justiceProcedure ? "oui" : "non" }}</div>
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="font-bold">Décision de justice rendue</div>
                    <div>
                        {{
                            town.justiceRenderedAt
                                ? `rendue le ${formatDate(
                                      town.justiceRenderedAt,
                                      "y/m/d"
                                  )}`
                                : "non"
                        }}
                    </div>
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="font-bold">Contentieux</div>
                    <div>{{ town.justiceChallenged ? "oui" : "non" }}</div>
                </div>
            </TownDetailsPanelSection>
            <TownDetailsPanelSection>
                <div class="flex items-center justify-between">
                    <div class="font-bold">Concours de la force publique</div>
                    <div>{{ policeStatusLabel }}</div>
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
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    },
    components: { TownDetailsPanel, TownDetailsPanelSection },
    computed: {
        policeStatusLabel() {
            if (this.town.policeStatus === "none") {
                return "Non demandé";
            }

            if (this.town.policeStatus === "requested") {
                return `Demandé le ${this.formatDate(
                    this.town.policeRequestedAt,
                    "y/m/d"
                )}`;
            }

            if (this.town.policeStatus === "granted") {
                return `Accordé le  ${this.formatDate(
                    this.town.policeGrantedAt,
                    "y/m/d"
                )}`;
            }

            return "NC";
        }
    }
};
</script>
