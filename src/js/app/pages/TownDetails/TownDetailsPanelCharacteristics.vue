<template>
    <TownDetailsPanel>
        <template v-slot:title>Caractéristiques du site</template>
        <template v-slot:body>
            <div class="flex">
                <div class="w-1/2 pr-8">
                    <TownDetailsPanelSection>
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-bold">
                                    Installé depuis
                                </div>
                                <div>
                                    {{ formatDateSince(town.builtAt) }}
                                </div>
                                <div>
                                    {{ formatDate(town.builtAt, "d/m/y") }}
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
                                    {{ formatDate(town.declaredAt, "d/m/y") }}
                                </div>
                            </div>
                        </div>
                    </TownDetailsPanelSection>

                    <TownDetailsPanelSection>
                        <div class="flex items-center  justify-between">
                            <div class="font-bold">
                                Type de site
                            </div>
                            <div>
                                {{ town.fieldType.label }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="flex items-center  justify-between">
                            <div class="font-bold">
                                Informations d'accès
                            </div>
                            <div>
                                {{ town.addressDetails }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="flex items-center justify-between">
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
                    MAP
                </div>
            </div>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import TownDetailsPanelSection from "./ui/TownDetailsPanelSection.vue";
import getSince from "./getSince";

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
        formatDateSince(date) {
            const { years, months } = getSince(date);
            if (years > 0) {
                return `${years} an${years > 1 ? "s" : ""}`;
            }

            if (months > 0) {
                return `${months} mois`;
            }

            return "";
        }
    }
};
</script>
