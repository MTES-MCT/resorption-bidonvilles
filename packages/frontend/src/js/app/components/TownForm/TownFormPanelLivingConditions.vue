<template>
    <FormGroup title="Conditions de vie et environnement">
        <FormParagraph
            title="Les habitants ont-ils accès à l'eau ?"
            :showMandatoryStar="true"
        >
            <InputAccessToWater
                v-model="input.access_to_water"
            ></InputAccessToWater>

            <div class="ml-12" v-if="input.access_to_water === 1">
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
                <div class="">
                    <InputWaterHandWashAccess
                        v-model="input.water_hand_wash_access"
                        withoutBorder
                    />
                    <InputWaterHandWashNumber
                        v-if="input.water_hand_wash_access > 0"
                        :population="population"
                        v-model="input.water_hand_wash_access_number"
                    />
                </div>
            </div>
            <div class="ml-12 mt-6">
                <InputWaterComments
                    :rules="
                        input.access_to_water === 1 &&
                        input.water_public_point > 0
                            ? 'required'
                            : ''
                    "
                    v-model="input.water_comments"
                ></InputWaterComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à des toilettes ?"
            :showMandatoryStar="true"
        >
            <InputAccessToSanitary
                v-model="input.access_to_sanitary"
            ></InputAccessToSanitary>
            <div class="ml-12" v-if="input.access_to_sanitary === 1">
                <InputSanitaryOnSite
                    v-model="input.sanitary_on_site"
                ></InputSanitaryOnSite>
                <InputSanitaryNumber
                    v-model="input.sanitary_number"
                    :population="population"
                ></InputSanitaryNumber>
                <InputSanitaryInsalubrious
                    v-model="input.sanitary_insalubrious"
                    class="mb-6"
                ></InputSanitaryInsalubrious>
            </div>
            <div class="ml-12 mt-6">
                <InputSanitaryComments
                    v-model="input.sanitary_comments"
                ></InputSanitaryComments>
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
            title="Le ramassage des déchets est-il organisé ?"
            :showMandatoryStar="true"
        >
            <InputTrashEvacuation
                v-model="input.trash_evacuation"
            ></InputTrashEvacuation>
            <div class="ml-12" v-if="input.trash_evacuation === 1">
                <InputTrashEvacuationRegular
                    v-model="input.trash_evacuation_regular"
                ></InputTrashEvacuationRegular>
                <InputTrashAccumulation
                    v-model="input.trash_accumulation"
                ></InputTrashAccumulation>
                <InputTrashCansOnSite
                    v-model="input.trash_cans_on_site"
                ></InputTrashCansOnSite>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Y a-t-il des nuisibles sur le site ou à proximité ?"
            :showMandatoryStar="true"
        >
            <InputVermin v-model="input.vermin"></InputVermin>
            <div class="ml-12">
                <InputVerminComments
                    v-model="input.vermin_comments"
                ></InputVerminComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Y a-t-il des mesures prévention incendie ?"
            :showMandatoryStar="true"
        >
            <InputFirePreventionMeasures
                v-model="input.fire_prevention_measures"
            ></InputFirePreventionMeasures>
            <div class="ml-12" v-if="input.fire_prevention_measures === 1">
                <InputFirePreventionDiagnostic
                    v-model="input.fire_prevention_diagnostic"
                ></InputFirePreventionDiagnostic>
                <InputFirePreventionSiteAccessible
                    v-model="input.fire_prevention_site_accessible"
                ></InputFirePreventionSiteAccessible>
                <InputFirePreventionDevices
                    v-model="input.fire_prevention_devices"
                ></InputFirePreventionDevices>
            </div>
            <div class="ml-12 mt-6">
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
import InputWaterHandWashNumber from "./inputs/InputWaterHandWashNumber.vue";
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
import InputFirePreventionDevices from "./inputs/InputFirePreventionDevices";

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
        InputWaterHandWashNumber,
        InputSanitaryNumber,
        InputSanitaryInsalubrious,
        InputSanitaryOnSite,
        InputVermin,
        InputVerminComments,
        InputFirePreventionMeasures,
        InputFirePreventionDiagnostic,
        InputFirePreventionComments,
        InputFirePreventionDevices
    },

    props: {
        value: {
            type: Object,
            required: true
        },
        population: {
            type: Object
        }
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
