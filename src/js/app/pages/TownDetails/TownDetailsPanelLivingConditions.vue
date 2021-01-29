<template>
    <TownDetailsPanel>
        <template v-slot:title>Conditions de vies</template>
        <template v-slot:body>
            <div class="grid grid-cols-2">
                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’eau"
                    :value="town.accessToWater"
                    cypressName="access_to_water"
                >
                    <span
                        data-cy-data="water_comments"
                        v-if="town.waterComments"
                        >{{ town.waterComments }}</span
                    >
                </TownDetailsPanelLivingConditionsSection>
                <TownDetailsPanelLivingConditionsSection
                    title="Accès aux toilettes"
                    :value="town.accessToSanitary"
                    cypressName="access_to_sanitary"
                >
                    <span
                        data-cy-data="sanitary_comments"
                        v-if="town.sanitaryComments"
                        >{{ town.sanitaryComments }}</span
                    >
                </TownDetailsPanelLivingConditionsSection>
                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’électricité"
                    :value="town.electricityType.value"
                    cypressName="electricity_type"
                >
                    <span
                        data-cy-data="electricity_comments"
                        v-if="town.electricityComments"
                        >{{ town.electricityComments }}</span
                    >
                </TownDetailsPanelLivingConditionsSection>
                <TownDetailsPanelLivingConditionsSection
                    title="Évacuation des déchets"
                    :value="town.trashEvacuation"
                    cypressName="trash_evacuation"
                />
            </div>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import TownDetailsPanelLivingConditionsSection from "./ui/TownDetailsPanelLivingConditionsSection";

export default {
    props: {
        town: {
            type: Object
        }
    },
    components: { TownDetailsPanelLivingConditionsSection, TownDetailsPanel }
};
</script>
