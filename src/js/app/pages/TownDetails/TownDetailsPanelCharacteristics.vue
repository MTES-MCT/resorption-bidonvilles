<template>
    <TownDetailsPanel>
        <template v-slot:title>Caractéristiques du site</template>
        <template v-slot:body>
            <div class="flex">
                <div class="w-1/2 pr-8">
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div>
                                <div class="font-bold">
                                    Installé depuis
                                </div>
                                <div>
                                    {{ formatDateSince(town.builtAt) }}
                                </div>
                                <div>
                                    {{ buildAt }}
                                </div>
                            </div>
                            <div>
                                <div class="font-bold">
                                    Signalé depuis
                                </div>
                                <div>
                                    {{ formatDateSince(town.declaredAt) }}
                                </div>
                                <div>
                                    {{ declaredAt }}
                                </div>
                            </div>
                        </div>
                    </TownDetailsPanelSection>

                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Type de site
                            </div>
                            <div class="flex items-center">
                                <Icon
                                    icon="map-marker-alt"
                                    class="text-lg mr-2"
                                    :style="`color: ${town.fieldType.color}`"
                                />
                                {{ town.fieldType.label }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection v-if="town.addressDetails">
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Informations d'accès
                            </div>
                            <div>
                                {{ town.addressDetails }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Propriétaire
                            </div>
                            <div>
                                {{ town.ownerType.label }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                </div>
                <div class="w-1/2 bg-G200">
                    <div class="v1">
                        <Map
                            :display-searchbar="false"
                            :towns="[town]"
                            :default-view="center"
                        ></Map>
                    </div>
                </div>
            </div>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import Map from "#app/components/map/map.vue";
import TownDetailsPanelSection from "./ui/TownDetailsPanelSection.vue";
import getSince from "../TownsList/getSince";

export default {
    props: {
        town: {
            type: Object
        }
    },
    components: { TownDetailsPanel, TownDetailsPanelSection, Map },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },
        formatDateSince(date) {
            const { days, years, months } = getSince(date);
            if (years > 0) {
                return `${years} an${years > 1 ? "s" : ""}`;
            }

            if (months > 0) {
                return `${months} mois`;
            }

            if (days > 0) {
                return `${days} jours`;
            }

            return "";
        }
    },
    computed: {
        buildAt() {
            return new Date(this.town.builtAt * 1000).toLocaleDateString(
                "fr-FR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
        },
        declaredAt() {
            return new Date(this.town.declaredAt * 1000).toLocaleDateString(
                "fr-FR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
        },
        center() {
            return {
                center: [this.town.latitude, this.town.longitude],
                zoom: 15
            };
        }
    }
};
</script>
