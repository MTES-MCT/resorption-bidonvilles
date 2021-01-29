<template>
    <FormGroup title="Conditions de vie et environnement">
        <FormParagraph
            title="Les habitants ont-ils accès à l'eau ?"
            :showMandatoryStar="true"
        >
            <InputAccessToWater
                v-model="input.access_to_water"
            ></InputAccessToWater>

            <div class="ml-12">
                <InputWaterPotable v-model="input.water_potable" />
                <InputWaterContinuousAccess
                    v-model="input.water_continuous_access"
                />
                <InputWaterPublicPoint v-model="input.water_public_point" />
                <InputWaterDistance v-model="input.water_distance" />
                <InputWaterRoadsToCross v-model="input.water_roads_to_cross" />
                <InputWaterEveryoneHasAccess
                    v-model="input.water_everyone_has_access"
                />
                <InputWaterStagnantWater v-model="input.water_stagnant_water" />
                <InputWaterHandWashAccess
                    v-model="input.water_hand_wash_access"
                    class="mb-6"
                />
                <InputWaterComments
                    v-model="input.water_comments"
                ></InputWaterComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à l'électricité ?"
            :showMandatoryStar="true"
        >
            <InputElectricityType
                v-model="input.electricity_type"
            ></InputElectricityType>
            <div class="ml-12">
                <InputElectricityComments
                    v-model="input.electricity_comments"
                ></InputElectricityComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à des toilettes ?"
            :showMandatoryStar="true"
        >
            <InputAccessToSanitary
                v-model="input.access_to_sanitary"
            ></InputAccessToSanitary>
            <div class="ml-12">
                <InputSanitaryNumber
                    v-model="input.sanitary_number"
                ></InputSanitaryNumber>
                <InputSanitaryInsalubrious
                    v-model="input.sanitary_insalubrious"
                ></InputSanitaryInsalubrious>
                <InputSanitaryOnSite
                    v-model="input.sanitary_on_site"
                    class="mb-6"
                ></InputSanitaryOnSite>
                <InputSanitaryComments
                    v-model="input.sanitary_comments"
                ></InputSanitaryComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="L'évacuation des déchets est-elle organisée ?"
            :showMandatoryStar="true"
        >
            <InputTrashEvacuation
                v-model="input.trash_evacuation"
            ></InputTrashEvacuation>
            <div class="ml-12">
                <InputTrashCansOnSite
                    v-model="input.trash_cans_on_site"
                ></InputTrashCansOnSite>
                <InputTrashAccumulation
                    v-model="input.trash_accumulation"
                ></InputTrashAccumulation>
                <InputTrashEvacuationRegular
                    v-model="input.trash_evacuation_regular"
                ></InputTrashEvacuationRegular>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Y a-t-il des nuisibles sur le site ou à proximité?"
        >
            <InputVermin v-model="input.vermin"></InputVermin>
            <div class="ml-12">
                <InputVerminComments
                    v-model="input.vermin_comments"
                ></InputVerminComments>
            </div>
        </FormParagraph>

        <FormParagraph title="Y a-t-il des mesures “prévention incendie” ?">
            <InputFirePreventionMeasures
                v-model="input.fire_prevention_measures"
            ></InputFirePreventionMeasures>
            <div class="ml-12">
                <InputFirePreventionDiagnostic
                    v-model="input.fire_prevention_diagnostic"
                ></InputFirePreventionDiagnostic>
                <InputFirePreventionSiteAccessible
                    v-model="input.fire_prevention_site_accessible"
                ></InputFirePreventionSiteAccessible>
                <InputFirePreventionComments
                    v-model="input.fire_prevention_comments"
                ></InputFirePreventionComments>
            </div>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputAccessToWater from "./inputs/InputAccessToWater.vue";
import InputWaterComments from "./inputs/InputWaterComments.vue";
import InputElectricityType from "./inputs/InputElectricityType.vue";
import InputElectricityComments from "./inputs/InputElectricityComments.vue";
import InputAccessToSanitary from "./inputs/InputAccessToSanitary.vue";
import InputSanitaryComments from "./inputs/InputSanitaryComments.vue";
import InputTrashEvacuation from "./inputs/InputTrashEvacuation.vue";
import InputWaterPotable from "./inputs/InputWaterPotable.vue";
import InputWaterContinuousAccess from "./inputs/InputWaterContinuousAccess.vue";
import InputWaterPublicPoint from "./inputs/InputWaterPublicPoint.vue";
import InputWaterDistance from "./inputs/InputWaterDistance.vue";
import InputWaterRoadsToCross from "./inputs/InputWaterRoadsToCross.vue";
import InputWaterEveryoneHasAccess from "./inputs/InputWaterEveryoneHasAccess.vue";
import InputWaterStagnantWater from "./inputs/InputWaterStagnantWater.vue";
import InputWaterHandWashAccess from "./inputs/InputWaterHandWashAccess.vue";
import InputSanitaryNumber from "./inputs/InputSanitaryNumber";
import InputSanitaryInsalubrious from "./inputs/InputSanitaryInsalubrious";
import InputSanitaryOnSite from "./inputs/InputSanitaryOnSite";
import InputTrashCansOnSite from "./inputs/InputTrashCansOnSite";
import InputTrashAccumulation from "./inputs/InputTrashAccumulation";
import InputTrashEvacuationRegular from "./inputs/InputTrashEvacuationRegular";
import InputVermin from "./inputs/InputVermin";
import InputVerminComments from "./inputs/InputVerminComments";
import InputFirePreventionMeasures from "./inputs/InputFirePreventionMeasures";
import InputFirePreventionDiagnostic from "./inputs/InputFirePreventionDiagnostic";
import InputFirePreventionSiteAccessible from "./inputs/InputFirePreventionSiteAccessible";
import InputFirePreventionComments from "./inputs/InputFirePreventionComments";

export default {
    components: {
        InputFirePreventionSiteAccessible,
        InputTrashEvacuationRegular,
        InputTrashAccumulation,
        InputTrashCansOnSite,
        InputAccessToWater,
        InputWaterComments,
        InputElectricityType,
        InputElectricityComments,
        InputAccessToSanitary,
        InputSanitaryComments,
        InputTrashEvacuation,
        InputWaterPotable,
        InputWaterContinuousAccess,
        InputWaterPublicPoint,
        InputWaterDistance,
        InputWaterRoadsToCross,
        InputWaterEveryoneHasAccess,
        InputWaterStagnantWater,
        InputWaterHandWashAccess,
        InputSanitaryNumber,
        InputSanitaryInsalubrious,
        InputSanitaryOnSite,
        InputVermin,
        InputVerminComments,
        InputFirePreventionMeasures,
        InputFirePreventionDiagnostic,
        InputFirePreventionComments
    },

    props: {
        value: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
