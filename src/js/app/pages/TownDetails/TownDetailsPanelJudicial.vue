<template>
    <TownDetailsPanel>
        <template v-slot:title>Procédure judiciaire</template>
        <template v-slot:body>
            <TownDetailsPanelSection>
                <div class="grid grid-cols-2">
                    <div class="flex items-center">
                        <Icon icon="scroll" class="mr-2" />
                        <div class="font-bold">
                            Dépôt de plainte du propriétaire
                        </div>
                    </div>
                    <div>{{ town.ownerComplaint ? "oui" : "non" }}</div>
                </div>
            </TownDetailsPanelSection>
            <div class="flex">
                <Icon icon="balance-scale" class="mr-4 mt-5" />
                <div class="flex-1">
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Existence d’une procédure judiciaire
                            </div>

                            <div class="-ml-5">
                                {{ town.justiceProcedure ? "oui" : "non" }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Décision de justice rendue
                            </div>

                            <div class="-ml-5">
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
                        <div class="grid grid-cols-2">
                            <div class="font-bold">Contentieux</div>

                            <div class="-ml-5">
                                {{ town.justiceChallenged ? "oui" : "non" }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                </div>
            </div>

            <TownDetailsPanelSection>
                <div class="grid grid-cols-2">
                    <div class="flex items-center">
                        <img :src="policeSiren" class="w-6 h-6 mr-2" />
                        <div class="font-bold">
                            Concours de la force publique
                        </div>
                    </div>
                    <div>{{ policeStatusLabel }}</div>
                </div>
            </TownDetailsPanelSection>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import TownDetailsPanelSection from "./ui/TownDetailsPanelSection.vue";
import policeSiren from "../TownsList/assets/police_siren.svg";

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
        policeSiren() {
            return policeSiren;
        },
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
