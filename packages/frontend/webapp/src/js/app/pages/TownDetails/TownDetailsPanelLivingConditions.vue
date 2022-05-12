<template>
    <DetailsPanel>
        <template v-slot:title>Conditions de vie et environnement</template>
        <template v-slot:body>
            <div>
                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’eau"
                    :value="town.livingConditions.water.access"
                    cypressName="access_to_water"
                    cypressComments="water_comments"
                    cypressDetailsPrefix="water"
                    :comments="town.livingConditions.water.comments"
                    :details="details.water"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Accès aux toilettes"
                    :value="town.livingConditions.sanitary.access"
                    cypressName="access_to_sanitary"
                    cypressComments="sanitary_comments"
                    cypressDetailsPrefix="sanitary"
                    :comments="town.livingConditions.sanitary.comments"
                    :details="details.sanitary"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Accès à l’électricité"
                    :value="town.livingConditions.electricity.type.value"
                    cypressName="electricity_type"
                    cypressComments="electricity_comments"
                    cypressDetailsPrefix="electricity"
                    :comments="town.livingConditions.electricity.comments"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Évacuation des déchets"
                    :value="town.livingConditions.trash.evacuation"
                    cypressName="trash_evacuation"
                    cypressComments="trash_comments"
                    cypressDetailsPrefix="trash"
                    :details="details.trash"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Présence de nuisibles"
                    :value="town.livingConditions.vermin.vermin"
                    cypressName="vermin"
                    inverted
                    cypressComments="vermin_comments"
                    cypressDetailsPrefix="vermin"
                    :comments="town.livingConditions.vermin.comments"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Prévention des incendies"
                    :value="town.livingConditions.firePrevention.measures"
                    cypressName="fire_prevention_measures"
                    cypressComments="fire_prevention_comments"
                    cypressDetailsPrefix="fire_prevention"
                    :comments="town.livingConditions.firePrevention.comments"
                    :details="details.firePrevention"
                />
            </div>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
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
    components: { TownDetailsPanelLivingConditionsSection, DetailsPanel }
};
</script>
