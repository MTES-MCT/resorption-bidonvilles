<template>
    <Fieldset
        legend="Comment les habitants ont-ils accès à l'eau ?"
        showMandatoryStar
    >
        <InputWaterAccessType />

        <div class="ml-12">
            <InputWaterAccessTypeDetails
                v-if="values.water_access_type === 'autre'"
            />

            <div
                v-if="
                    ['robinet_connecte_au_reseau', 'autre'].includes(
                        values.water_access_type
                    )
                "
            >
                <InputWaterAccessIsPublic />

                <InputWaterAccessIsContinuous
                    v-if="values.water_access_is_public === 0"
                />
                <div
                    class="mt-4 ml-12"
                    v-if="
                        values.water_access_is_public === 0 &&
                        values.water_access_is_continuous === 0
                    "
                >
                    <InputWaterAccessIsContinuousDetails />
                </div>

                <InputWaterAccessIsLocal
                    v-if="values.water_access_is_public === 0"
                />

                <InputWaterAccessIsClose
                    v-if="
                        values.water_access_is_public === 0 &&
                        values.water_access_is_local === 1
                    "
                />

                <InputWaterAccessIsUnequal
                    v-if="
                        values.water_access_is_public === 0 &&
                        values.water_access_is_local === 1
                    "
                />
                <div
                    class="mt-4 ml-12"
                    v-if="
                        values.water_access_is_public === 0 &&
                        values.water_access_is_local === 1 &&
                        values.water_access_is_unequal === 1
                    "
                >
                    <InputWaterAccessIsUnequalDetails />
                </div>

                <InputWaterAccessHasStagnantWater
                    v-if="
                        values.water_access_is_public === 0 &&
                        values.water_access_is_local === 1
                    "
                />
            </div>
        </div>

        <div class="mt-6">
            <InputWaterAccessComments />
        </div>
    </Fieldset>

    <Fieldset
        legend="Les habitants ont-ils accès à des toilettes fonctionnelles ?"
        showMandatoryStar
    >
        <InputSanitaryWorkingToilets />

        <div class="ml-12">
            <InputSanitaryOpenAirDefecation />
            <div class="mt-2 mb-1" v-if="values.sanitary_working_toilets === 1">
                <InputSanitaryToiletTypes />
            </div>
            <template
                v-if="values.sanitary_working_toilets === 1 && notOnlyLatrines"
            >
                <InputSanitaryToiletsAreInside />
                <InputSanitaryToiletsAreLighted />
                <InputSanitaryHandWashing />
            </template>
        </div>
    </Fieldset>

    <Fieldset
        class="mt-8"
        legend="Les habitants ont-ils accès à l'électricité ?"
        showMandatoryStar
    >
        <InputElectricityAccess />

        <div class="ml-12" v-if="values.electricity_access === 1">
            <InputElectricityAccessTypes />
            <InputElectricityAccessIsUnequal
                v-if="values.electricity_access_types?.length > 0"
            />
        </div>
    </Fieldset>

    <Fieldset class="mt-8" legend="Le ramassage des déchets est-il organisé ?">
        <InputTrashIsPiling />
        <InputTrashEvacuationIsClose />

        <div class="ml-12" v-if="values.trash_evacuation_is_close === 1">
            <InputTrashEvacuationIsSafe />
            <InputTrashEvacuationIsRegular />
            <InputTrashBulkyIsPiling />
        </div>
    </Fieldset>

    <Fieldset
        class="mt-8"
        legend="Y a-t-il des nuisibles sur le site ou à proximité ?"
        showMandatoryStar
    >
        <InputPestAnimals />
        <InputPestAnimalsComments />
    </Fieldset>

    <Fieldset
        legend="Un diagnostic prévention incendie a-t-il été réalisé par le SDIS (Service départemental d'incendie et de secours) ?"
        showMandatoryStar
    >
        <InputFirePrevention />
    </Fieldset>
</template>

<script setup>
import { computed } from "vue";
import { useFieldValue, useFormValues } from "vee-validate";
import { Fieldset } from "@resorptionbidonvilles/ui";
import InputWaterAccessType from "../inputs/FormDeclarationDeSiteInputWaterAccessType.vue";
import InputWaterAccessTypeDetails from "../inputs/FormDeclarationDeSiteInputWaterAccessTypeDetails.vue";
import InputWaterAccessIsPublic from "../inputs/FormDeclarationDeSiteInputWaterAccessIsPublic.vue";
import InputWaterAccessIsContinuous from "../inputs/FormDeclarationDeSiteInputWaterAccessIsContinuous.vue";
import InputWaterAccessIsContinuousDetails from "../inputs/FormDeclarationDeSiteInputWaterAccessIsContinuousDetails.vue";
import InputWaterAccessIsLocal from "../inputs/FormDeclarationDeSiteInputWaterAccessIsLocal.vue";
import InputWaterAccessIsClose from "../inputs/FormDeclarationDeSiteInputWaterAccessIsClose.vue";
import InputWaterAccessIsUnequal from "../inputs/FormDeclarationDeSiteInputWaterAccessIsUnequal.vue";
import InputWaterAccessIsUnequalDetails from "../inputs/FormDeclarationDeSiteInputWaterAccessIsUnequalDetails.vue";
import InputWaterAccessHasStagnantWater from "../inputs/FormDeclarationDeSiteInputWaterAccessHasStagnantWater.vue";
import InputWaterAccessComments from "../inputs/FormDeclarationDeSiteInputWaterAccessComments.vue";
import InputSanitaryWorkingToilets from "../inputs/FormDeclarationDeSiteInputSanitaryWorkingToilets.vue";
import InputSanitaryOpenAirDefecation from "../inputs/FormDeclarationDeSiteInputSanitaryOpenAirDefecation.vue";
import InputSanitaryToiletTypes from "../inputs/FormDeclarationDeSiteInputSanitaryToiletTypes.vue";
import InputSanitaryToiletsAreInside from "../inputs/FormDeclarationDeSiteInputSanitaryToiletsAreInside.vue";
import InputSanitaryToiletsAreLighted from "../inputs/FormDeclarationDeSiteInputSanitaryToiletsAreLighted.vue";
import InputSanitaryHandWashing from "../inputs/FormDeclarationDeSiteInputSanitaryHandWashing.vue";
import InputElectricityAccess from "../inputs/FormDeclarationDeSiteInputElectricityAccess.vue";
import InputElectricityAccessTypes from "../inputs/FormDeclarationDeSiteInputElectricityAccessTypes.vue";
import InputElectricityAccessIsUnequal from "../inputs/FormDeclarationDeSiteInputElectricityAccessIsUnequal.vue";
import InputTrashIsPiling from "../inputs/FormDeclarationDeSiteInputTrashIsPiling.vue";
import InputTrashEvacuationIsClose from "../inputs/FormDeclarationDeSiteInputTrashEvacuationIsClose.vue";
import InputTrashEvacuationIsSafe from "../inputs/FormDeclarationDeSiteInputTrashEvacuationIsSafe.vue";
import InputTrashEvacuationIsRegular from "../inputs/FormDeclarationDeSiteInputTrashEvacuationIsRegular.vue";
import InputTrashBulkyIsPiling from "../inputs/FormDeclarationDeSiteInputTrashBulkyIsPiling.vue";
import InputPestAnimals from "../inputs/FormDeclarationDeSiteInputPestAnimals.vue";
import InputPestAnimalsComments from "../inputs/FormDeclarationDeSiteInputPestAnimalsComments.vue";
import InputFirePrevention from "../inputs/FormDeclarationDeSiteInputFirePrevention.vue";

const values = useFormValues();
const toiletTypes = useFieldValue("sanitary_toilet_types");
const notOnlyLatrines = computed(() => {
    if (!toiletTypes.value?.length) {
        return false;
    }

    return (
        toiletTypes.value.length > 1 || !toiletTypes.value.includes("latrines")
    );
});
</script>
