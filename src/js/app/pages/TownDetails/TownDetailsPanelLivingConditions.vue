<template>
    <TownDetailsPanel>
        <template v-slot:title>Conditions de vies</template>
        <template v-slot:body>
            <div class="grid grid-cols-2">
                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’eau"
                    :value="town.accessToWater"
                >
                    {{ town.waterComments }}
                </TownDetailsPanelLivingConditionsSection>
                <TownDetailsPanelLivingConditionsSection
                    title="Accès aux toilettes"
                    :value="town.accessToSanitary"
                    >{{
                        town.sanitaryComments
                    }}</TownDetailsPanelLivingConditionsSection
                >
                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’électricité"
                    :value="town.electricityType.value"
                    >{{
                        town.electricityComments
                    }}</TownDetailsPanelLivingConditionsSection
                >
                <TownDetailsPanelLivingConditionsSection
                    title="Évacuation des déchets"
                    :value="town.trashEvacuation"
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
