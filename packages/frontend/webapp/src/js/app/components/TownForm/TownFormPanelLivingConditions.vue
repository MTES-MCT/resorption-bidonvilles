<template>
    <FormGroup title="Conditions de vie et environnement (anciennes questions)">
        <FormParagraph
            title="Les habitants ont-ils accès à l'eau ?"
            :showMandatoryStar="true"
        >
            <InputAccessToWater
                v-model="input.water.access"
            ></InputAccessToWater>

            <div class="ml-12" v-if="input.water.access === 1">
                <InputWaterPotable v-model="input.water.potable" />
                <InputWaterContinuousAccess
                    v-model="input.water.continuousAccess"
                />
                <InputWaterPublicPoint v-model="input.water.publicPoint" />
                <InputWaterDistance v-model="input.water.distance" />
                <InputWaterRoadsToCross v-model="input.water.roadsToCross" />
                <InputWaterEveryoneHasAccess
                    v-model="input.water.everyoneHasAccess"
                />
                <InputWaterStagnantWater v-model="input.water.stagnantWater" />
                <div class="">
                    <InputWaterHandWashAccess
                        v-model="input.water.handWashAccess"
                        withoutBorder
                    />
                    <InputWaterHandWashNumber
                        v-if="input.water.handWashAccess > 0"
                        :population="population"
                        v-model="input.water.handWashAccessNumber"
                    />
                </div>
            </div>
            <div class="ml-12 mt-6">
                <InputWaterComments
                    :rules="
                        input.water.access === 1 && input.water.publicPoint > 0
                            ? 'required'
                            : ''
                    "
                    v-model="input.water.comments"
                ></InputWaterComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à des toilettes ?"
            :showMandatoryStar="true"
        >
            <InputAccessToSanitary
                v-model="input.sanitary.access"
            ></InputAccessToSanitary>
            <div class="ml-12" v-if="input.sanitary.access === 1">
                <InputSanitaryOnSite
                    v-model="input.sanitary.onSite"
                ></InputSanitaryOnSite>
                <InputSanitaryNumber
                    v-model="input.sanitary.number"
                    :population="population"
                ></InputSanitaryNumber>
                <InputSanitaryInsalubrious
                    v-model="input.sanitary.insalubrious"
                    class="mb-6"
                ></InputSanitaryInsalubrious>
            </div>
            <div class="ml-12 mt-6">
                <InputSanitaryComments
                    v-model="input.sanitary.comments"
                ></InputSanitaryComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à l'électricité ?"
            :showMandatoryStar="true"
        >
            <InputElectricityType
                v-model="input.electricity.type"
            ></InputElectricityType>
            <div class="ml-12">
                <InputElectricityComments
                    v-model="input.electricity.comments"
                ></InputElectricityComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Le ramassage des déchets est-il organisé ?"
            :showMandatoryStar="true"
        >
            <InputTrashEvacuation
                v-model="input.trash.evacuation"
            ></InputTrashEvacuation>
            <div class="ml-12" v-if="input.trash.evacuation === 1">
                <InputTrashEvacuationRegular
                    v-model="input.trash.evacuationRegular"
                ></InputTrashEvacuationRegular>
                <InputTrashAccumulation
                    v-model="input.trash.accumulation"
                ></InputTrashAccumulation>
                <InputTrashCansOnSite
                    v-model="input.trash.cansOnSite"
                ></InputTrashCansOnSite>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Y a-t-il des nuisibles sur le site ou à proximité ?"
            :showMandatoryStar="true"
        >
            <InputVermin v-model="input.vermin.vermin"></InputVermin>
            <div class="ml-12">
                <InputVerminComments
                    v-model="input.vermin.comments"
                ></InputVerminComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Y a-t-il des mesures prévention incendie ?"
            :showMandatoryStar="true"
        >
            <InputFirePreventionMeasures
                v-model="input.firePrevention.measures"
            ></InputFirePreventionMeasures>
            <div class="ml-12" v-if="input.firePrevention.measures === 1">
                <InputFirePreventionDiagnostic
                    v-model="input.firePrevention.diagnostic"
                ></InputFirePreventionDiagnostic>
                <InputFirePreventionSiteAccessible
                    v-model="input.firePrevention.siteAccessible"
                ></InputFirePreventionSiteAccessible>
                <InputFirePreventionDevices
                    v-model="input.firePrevention.devices"
                ></InputFirePreventionDevices>
            </div>
            <div class="ml-12 mt-6">
                <InputFirePreventionComments
                    v-model="input.firePrevention.comments"
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
