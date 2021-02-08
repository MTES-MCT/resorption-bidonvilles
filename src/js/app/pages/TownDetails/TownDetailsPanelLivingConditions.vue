<template>
    <TownDetailsPanel>
        <template v-slot:title>Conditions de vie et environnement</template>
        <template v-slot:body>
            <div>
                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’eau"
                    :value="town.accessToWater"
                    cypressName="access_to_water"
                    cypressComments="water_comments"
                    cypressDetailsPrefix="water"
                    :comments="town.waterComments"
                    :details="details.water"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Accès aux toilettes"
                    :value="town.accessToSanitary"
                    cypressName="access_to_sanitary"
                    cypressComments="sanitary_comments"
                    cypressDetailsPrefix="sanitary"
                    :comments="town.sanitaryComments"
                    :details="details.sanitary"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’électricité"
                    :value="town.electricityType.value"
                    cypressName="electricity_type"
                    cypressComments="electricity_comments"
                    cypressDetailsPrefix="electricity"
                    :comments="town.electricityComments"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Évacuation des déchets"
                    :value="town.trashEvacuation"
                    cypressName="trash_evacuation"
                    cypressComments="trash_comments"
                    cypressDetailsPrefix="trash"
                    :details="details.trash"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Présence de nuisibles"
                    :value="town.vermin"
                    cypressName="vermin"
                    cypressComments="vermin_comments"
                    cypressDetailsPrefix="vermin"
                    :comments="town.verminComments"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Prévention des incendies"
                    :value="town.firePreventionMeasures"
                    cypressName="fire_prevention_measures"
                    cypressComments="fire_prevention_comments"
                    cypressDetailsPrefix="fire_prevention"
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
