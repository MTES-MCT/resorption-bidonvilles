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
                    <div data-cy-data="owner_complaint">
                        {{ boolToStr(town.ownerComplaint) }}
                    </div>
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

                            <div class="-ml-5" data-cy-data="justice_procedure">
                                {{ boolToStr(town.justiceProcedure) }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Décision de justice rendue
                            </div>

                            <div class="-ml-5" data-cy-data="justice_rendered">
                                {{ justiceRendered }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">Contentieux</div>

                            <div
                                class="-ml-5"
                                data-cy-data="justice_challenged"
                            >
                                {{ boolToStr(town.justiceChallenged) }}
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
                    <div data-cy-data="police_status">
                        {{ policeStatusLabel }}
                    </div>
                </div>
            </TownDetailsPanelSection>

            <TownDetailsPanelSection>
                <div class="grid grid-cols-2">
                    <div class="flex items-center">
                        <span class="w-6 h-6 mr-2 text-center"
                            ><Icon icon="file"></Icon
                        ></span>
                        <div class="font-bold">
                            Nom de l'étude d'huissier
                        </div>
                    </div>

                    <div data-cy-data="bailiff">
                        {{ town.bailiff || "NC" }}
                    </div>
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
        },

        boolToStr(bool) {
            if (bool === null) {
                return "NC";
            }

            return bool ? "oui" : "non";
        }
    },
    components: { TownDetailsPanel, TownDetailsPanelSection },
    computed: {
        justiceRendered() {
            if (this.town.justiceRendered === null) {
                return "NC";
            }

            return this.town.justiceRendered
                ? `rendue le ${this.formatDate(
                      this.town.justiceRenderedAt,
                      "d/m/y"
                  )}`
                : "non";
        },
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
                    "d/m/y"
                )}`;
            }

            if (this.town.policeStatus === "granted") {
                return `Accordé le ${this.formatDate(
                    this.town.policeGrantedAt,
                    "d/m/y"
                )}`;
            }

            return "NC";
        }
    }
};
</script>
