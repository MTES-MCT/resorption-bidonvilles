<template>
    <TownDetailsPanel>
        <template v-slot:title>Conditions de vie et environnement</template>
        <template v-slot:body>
            <div>
                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’eau"
                    :value="town.accessToWater"
                    cypressName="access_to_water"
                    :comments="town.waterComments"
                    :details="details.water"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Accès aux toilettes"
                    :value="town.accessToSanitary"
                    cypressName="access_to_sanitary"
                    :comments="town.sanitaryComments"
                    :details="details.sanitary"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’électricité"
                    :value="town.electricityType.value"
                    cypressName="electricity_type"
                    :comments="town.electricityComments"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Évacuation des déchets"
                    :value="town.trashEvacuation"
                    cypressName="trash_evacuation"
                    :details="details.trash"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Présence de nuisibles"
                    :value="town.vermin"
                    cypressName="vermin"
                    :comments="town.verminComments"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Prévention des incendies"
                    :value="town.firePreventionMeasures"
                    cypressName="fire_prevention_measures"
                    :comments="town.firePreventionComments"
                    :details="details.fire"
                />
            </div>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import TownDetailsPanelLivingConditionsSection from "./ui/TownDetailsPanelLivingConditionsSection";
import { formatLivingConditions } from "./formatLivingConditions.js";

export default {
    props: {
        town: {
            type: Object
        }
    },
    data() {
        return {
            details: formatLivingConditions(this.town)
        };
    },
    components: { TownDetailsPanelLivingConditionsSection, TownDetailsPanel }
};
</script>
