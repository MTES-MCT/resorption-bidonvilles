<template>
    <DetailsPanel>
        <template v-slot:title>Conditions de vie et environnement</template>
        <template v-slot:body>
            <Tag variant="pin_red" v-if="town.livingConditions.version < 2"
                >LES CONDITIONS DE VIE DOIVENT ÊTRE MISES A JOUR</Tag
            >

            <TownDetailsPanelLivingConditionsSection
                title="Accès à l’eau"
                :status="town.livingConditions.water.status"
                cypressName="access_to_water"
                cypressComments="water_comments"
                cypressDetailsPrefix="water"
                :comments="
                    town.livingConditions.water.comments ||
                        town.livingConditions.water.access_comments
                "
            />

            <TownDetailsPanelLivingConditionsSection
                title="Accès aux toilettes"
                :status="town.livingConditions.sanitary.status"
                cypressName="access_to_sanitary"
                cypressComments="sanitary_comments"
                cypressDetailsPrefix="sanitary"
                :comments="town.livingConditions.sanitary.comments"
            />

            <TownDetailsPanelLivingConditionsSection
                title="Accès à l’électricité"
                sanitary
                :status="town.livingConditions.electricity.status"
                cypressName="electricity_type"
                cypressComments="electricity_comments"
                cypressDetailsPrefix="electricity"
                :comments="town.livingConditions.electricity.comments"
            />

            <TownDetailsPanelLivingConditionsSection
                title="Évacuation des déchets"
                :status="town.livingConditions.trash.status"
                cypressName="trash_evacuation"
                cypressComments="trash_comments"
                cypressDetailsPrefix="trash"
            />

            <div v-if="town.livingConditions.version === 1">
                <TownDetailsPanelLivingConditionsSection
                    title="Présence de nuisibles"
                    :status="town.livingConditions.vermin.status"
                    cypressName="vermin"
                    cypressComments="vermin_comments"
                    cypressDetailsPrefix="vermin"
                    :comments="town.livingConditions.vermin.comments"
                    :inverted="true"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Prévention des incendies"
                    :status="town.livingConditions.firePrevention.status"
                    cypressName="fire_prevention_measures"
                    cypressComments="fire_prevention_comments"
                    cypressDetailsPrefix="fire_prevention"
                    :comments="town.livingConditions.firePrevention.comments"
                />
            </div>

            <div v-if="town.livingConditions.version === 2">
                <TownDetailsPanelLivingConditionsSection
                    title="Présence de nuisibles"
                    :status="town.livingConditions.pest_animals.status"
                    :inverted="true"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Prévention des incendies"
                    :status="town.livingConditions.fire_prevention.status"
                />
            </div>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import TownDetailsPanelLivingConditionsSection from "./ui/TownDetailsPanelLivingConditionsSection";

export default {
    props: {
        town: {
            type: Object
        }
    },
    components: { TownDetailsPanelLivingConditionsSection, DetailsPanel }
};
</script>
