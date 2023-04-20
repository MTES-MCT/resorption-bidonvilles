<template>
    <FormSection id="anciennes_conditions_de_vie">
        <template v-slot:title
            >Anciennes conditions de vie et environnement</template
        >

        <FormParagraph title="Comment les habitants ont-ils accès à l'eau ?">
            <InputAccessToWater />

            <div class="ml-12" v-if="conditions.water.access === true">
                <InputWaterPotable />
                <InputWaterContinuousAccess />
                <InputWaterPublicPoint />
                <InputWaterDistance />
                <InputWaterRoadsToCross />
                <InputWaterEveryoneHasAccess />
                <InputWaterStagnantWater />
                <InputWaterHandWashAccess withoutBorder />
                <InputWaterHandWashNumber
                    v-if="conditions.water.handWashAccess > 0"
                    :population="population"
                />
            </div>
            <div class="ml-12 mt-6">
                <InputWaterComments />
            </div>
        </FormParagraph>

        <FormParagraph title="Les habitants ont-ils accès à des toilettes ?">
            <InputAccessToSanitary />
            <div class="ml-12" v-if="conditions.sanitary.access === true">
                <InputSanitaryOnSite />
                <InputSanitaryNumber :population="population" />
                <InputSanitaryInsalubrious class="mb-6" />
            </div>
            <div class="ml-12 mt-6">
                <InputSanitaryComments />
            </div>
        </FormParagraph>

        <FormParagraph title="Les habitants ont-ils accès à l'électricité ?">
            <InputElectricityType />
            <div class="ml-12">
                <InputElectricityComments />
            </div>
        </FormParagraph>

        <FormParagraph title="Le ramassage des déchets est-il organisé ?">
            <InputTrashEvacuation />
            <div class="ml-12" v-if="conditions.trash.evacuation === true">
                <InputTrashEvacuationRegular />
                <InputTrashAccumulation />
                <InputTrashCansOnSite />
            </div>
        </FormParagraph>

        <FormParagraph
            title="Y a-t-il des nuisibles sur le site ou à proximité ?"
        >
            <InputVermin />
            <div class="ml-12">
                <InputVerminComments />
            </div>
        </FormParagraph>

        <FormParagraph title="Y a-t-il des mesures prévention incendie ?">
            <InputFirePreventionMeasures />
            <div
                class="ml-12"
                v-if="conditions.firePrevention.measures === true"
            >
                <InputFirePreventionDiagnostic />
                <InputFirePreventionSiteAccessible />
                <InputFirePreventionDevices />
            </div>
            <div class="ml-12 mt-6">
                <InputFirePreventionComments />
            </div>
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { computed, toRefs } from "vue";
import formatIntToStr from "@/utils/formatIntToStr";

import { FormParagraph } from "@resorptionbidonvilles/ui";
import FormSection from "@/components/FormSection/FormSection.vue";
import InputAccessToWater from "../oldInputs/OldInputAccessToWater.vue";
import InputWaterPotable from "../oldInputs/OldInputWaterPotable.vue";
import InputWaterContinuousAccess from "../oldInputs/OldInputWaterContinuousAccess.vue";
import InputWaterPublicPoint from "../oldInputs/OldInputWaterPublicPoint.vue";
import InputWaterDistance from "../oldInputs/OldInputWaterDistance.vue";
import InputWaterRoadsToCross from "../oldInputs/OldInputWaterRoadsToCross.vue";
import InputWaterEveryoneHasAccess from "../oldInputs/OldInputWaterEveryoneHasAccess.vue";
import InputWaterStagnantWater from "../oldInputs/OldInputWaterStagnantWater.vue";
import InputWaterHandWashAccess from "../oldInputs/OldInputWaterHandWashAccess.vue";
import InputWaterHandWashNumber from "../oldInputs/OldInputWaterHandWashNumber.vue";
import InputWaterComments from "../oldInputs/OldInputWaterComments.vue";
import InputAccessToSanitary from "../oldInputs/OldInputAccessToSanitary.vue";
import InputSanitaryOnSite from "../oldInputs/OldInputSanitaryOnSite.vue";
import InputSanitaryNumber from "../oldInputs/OldInputSanitaryNumber.vue";
import InputSanitaryInsalubrious from "../oldInputs/OldInputSanitaryInsalubrious.vue";
import InputSanitaryComments from "../oldInputs/OldInputSanitaryComments.vue";
import InputElectricityType from "../oldInputs/OldInputElectricityType.vue";
import InputElectricityComments from "../oldInputs/OldInputElectricityComments.vue";
import InputTrashEvacuation from "../oldInputs/OldInputTrashEvacuation.vue";
import InputTrashEvacuationRegular from "../oldInputs/OldInputTrashEvacuationRegular.vue";
import InputTrashAccumulation from "../oldInputs/OldInputTrashAccumulation.vue";
import InputTrashCansOnSite from "../oldInputs/OldInputTrashCansOnSite.vue";
import InputVermin from "../oldInputs/OldInputVermin.vue";
import InputVerminComments from "../oldInputs/OldInputVerminComments.vue";
import InputFirePreventionMeasures from "../oldInputs/OldInputFirePreventionMeasures.vue";
import InputFirePreventionDiagnostic from "../oldInputs/OldInputFirePreventionDiagnostic.vue";
import InputFirePreventionSiteAccessible from "../oldInputs/OldInputFirePreventionSiteAccessible.vue";
import InputFirePreventionDevices from "../oldInputs/OldInputFirePreventionDevices.vue";
import InputFirePreventionComments from "../oldInputs/OldInputFirePreventionComments.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const conditions = computed(() => {
    return town.value.livingConditions;
});
const population = computed(() => {
    return {
        populationTotal: formatIntToStr(town.value.populationTotal),
        populationCouples: formatIntToStr(town.value.populationCouples),
        populationMinors: formatIntToStr(town.value.populationMinors),
    };
});
</script>
