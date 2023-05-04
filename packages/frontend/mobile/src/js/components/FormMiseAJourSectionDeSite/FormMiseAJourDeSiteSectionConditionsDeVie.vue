<template>
    <h1 class="text-2xl sm:text-3xl font-bold px-5">Habitants</h1>
    <p class="px-5">
        Situation du site au
        {{ formatDate(today.getTime() / 1000, "d M y") }}
    </p>
    <div class="px-5">
        <FormParagraph
            title="Comment les habitants ont-ils accès à l'eau ?"
            showMandatoryStar
        >
            <InputWaterAccessType />

            <div>
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
                        class="mt-4"
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
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à des toilettes fonctionnelles ?"
            showMandatoryStar
        >
            <InputSanitaryWorkingToilets />

            <div>
                <InputSanitaryOpenAirDefecation />
                <div
                    class="mt-2 mb-1"
                    v-if="values.sanitary_working_toilets === 1"
                >
                    <InputSanitaryToiletTypes />
                </div>
                <template
                    v-if="
                        values.sanitary_working_toilets === 1 && notOnlyLatrines
                    "
                >
                    <InputSanitaryToiletsAreInside />
                    <InputSanitaryToiletsAreLighted />
                    <InputSanitaryHandWashing />
                </template>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à l'électricité ?"
            showMandatoryStar
        >
            <InputElectricityAccess />

            <div v-if="values.electricity_access === 1">
                <InputElectricityAccessTypes />
                <InputElectricityAccessIsUnequal
                    v-if="values.electricity_access_types?.length > 0"
                />
            </div>
        </FormParagraph>
        <FormParagraph title="Le ramassage des déchets est-il organisé ?">
            <InputTrashIsPiling />
            <InputTrashEvacuationIsClose />
            <div v-if="values.trash_evacuation_is_close === 1">
                <InputTrashEvacuationIsSafe />
                <InputTrashEvacuationIsRegular />
                <InputTrashBulkyIsPiling />
            </div>
        </FormParagraph>
        <FormParagraph
            title="Y a-t-il des nuisibles sur le site ou à proximité ?"
            showMandatoryStar
        >
            <InputPestAnimals />
            <InputPestAnimalsComments />
        </FormParagraph>
        <FormParagraph
            title="Un diagnostic prévention incendie a-t-il été réalisé par le SDIS (Service départemental d'incendie et de secours) ?"
            showMandatoryStar
        >
            <InputFirePrevention />
        </FormParagraph>
    </div>
</template>
<script setup>
import formatDate from "#frontend/common/utils/formatDate";
import { useFormValues } from "vee-validate";

import { FormParagraph } from "@resorptionbidonvilles/ui";
import InputWaterAccessType from "./inputs/InputWaterAccessType.vue";
import InputWaterAccessTypeDetails from "./inputs/InputWaterAccessTypeDetails.vue";
import InputWaterAccessIsPublic from "./inputs/InputWaterAccessIsPublic.vue";
import InputWaterAccessIsContinuous from "./inputs/InputWaterAccessIsContinuous.vue";
import InputWaterAccessIsContinuousDetails from "./inputs/InputWaterAccessIsContinuousDetails.vue";
import InputWaterAccessIsLocal from "./inputs/InputWaterAccessIsLocal.vue";
import InputWaterAccessIsClose from "./inputs/InputWaterAccessIsClose.vue";
import InputWaterAccessIsUnequal from "./inputs/InputWaterAccessIsUnequal.vue";
import InputWaterAccessIsUnequalDetails from "./inputs/InputWaterAccessIsUnequalDetails.vue";
import InputWaterAccessHasStagnantWater from "./inputs/InputWaterAccessHasStagnantWater.vue";
import InputWaterAccessComments from "./inputs/InputWaterAccessComments.vue";
import InputSanitaryWorkingToilets from "./inputs/InputSanitaryWorkingToilets.vue";
import InputSanitaryOpenAirDefecation from "./inputs/InputSanitaryOpenAirDefecation.vue";
import InputSanitaryToiletTypes from "./inputs/InputSanitaryToiletTypes.vue";
import InputSanitaryToiletsAreInside from "./inputs/InputSanitaryToiletsAreInside.vue";
import InputSanitaryToiletsAreLighted from "./inputs/InputSanitaryToiletsAreLighted.vue";
import InputSanitaryHandWashing from "./inputs/InputSanitaryHandWashing.vue";
import InputElectricityAccess from "./inputs/InputElectricityAccess.vue";
import InputElectricityAccessTypes from "./inputs/InputElectricityAccessTypes.vue";
import InputElectricityAccessIsUnequal from "./inputs/InputElectricityAccessIsUnequal.vue";
import InputTrashIsPiling from "./inputs/InputTrashIsPiling.vue";
import InputTrashEvacuationIsClose from "./inputs/InputTrashEvacuationIsClose.vue";
import InputTrashEvacuationIsSafe from "./inputs/InputTrashEvacuationIsSafe.vue";
import InputTrashEvacuationIsRegular from "./inputs/InputTrashEvacuationIsRegular.vue";
import InputTrashBulkyIsPiling from "./inputs/InputTrashBulkyIsPiling.vue";
import InputPestAnimals from "./inputs/InputPestAnimals.vue";
import InputPestAnimalsComments from "./inputs/InputPestAnimalsComments.vue";
import InputFirePrevention from "./inputs/InputFirePrevention.vue";

const today = new Date();

const values = useFormValues();
</script>
