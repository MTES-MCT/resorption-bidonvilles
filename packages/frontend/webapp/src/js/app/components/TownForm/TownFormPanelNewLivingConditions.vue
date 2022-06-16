<template>
    <FormGroup title="Conditions de vie et environnement">
        <FormParagraph
            title="Les habitants ont-ils accès à l'eau ?"
            :showMandatoryStar="true"
        >
            <InputWaterAccessType
                v-model="input.water.access_type"
            ></InputWaterAccessType>

            <div class="ml-12">
                <InputWaterAccessTypeDetails
                    v-if="input.water.access_type === 'autre'"
                    v-model="input.water.access_type_details"
                />

                <div
                    v-if="
                        ['robinet_connecte_au_reseau', 'autre'].includes(
                            input.water.access_type
                        )
                    "
                >
                    <InputWaterAccessIsPublic
                        v-model="input.water.access_is_public"
                    />

                    <InputWaterAccessIsContinuous
                        v-if="input.water.access_is_public === 0"
                        v-model="input.water.access_is_continuous"
                    />
                    <div class="mt-4 ml-12">
                        <InputWaterAccessIsContinuousDetails
                            v-if="
                                input.water.access_is_public === 0 &&
                                    input.water.access_is_continuous === 0
                            "
                            v-model="input.water.access_is_continuous_details"
                        />
                    </div>

                    <InputWaterAccessIsLocal
                        v-if="input.water.access_is_public === 0"
                        v-model="input.water.access_is_local"
                    />

                    <InputWaterAccessIsClose
                        v-if="
                            input.water.access_is_public === 0 &&
                                input.water.access_is_local === 1
                        "
                        v-model="input.water.access_is_close"
                    />

                    <InputWaterAccessIsUnequal
                        v-if="
                            input.water.access_is_public === 0 &&
                                input.water.access_is_local === 1
                        "
                        v-model="input.water.access_is_unequal"
                    />
                    <div class="mt-4 ml-12">
                        <InputWaterAccessIsUnequalDetails
                            v-if="
                                input.water.access_is_public === 0 &&
                                    input.water.access_is_local === 1 &&
                                    input.water.access_is_unequal === 1
                            "
                            v-model="input.water.access_is_unequal_details"
                        />
                    </div>

                    <InputWaterAccessHasStagnantWater
                        v-if="
                            input.water.access_is_public === 0 &&
                                input.water.access_is_local === 1
                        "
                        v-model="input.water.access_has_stagnant_water"
                    />
                </div>
            </div>

            <div class="mt-6">
                <InputWaterAccessComments
                    v-model="input.water.access_comments"
                ></InputWaterAccessComments>
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à des toilettes fonctionnelles ?"
            :showMandatoryStar="true"
        >
            <InputSanitaryWorkingToilets
                v-model="input.sanitary.working_toilets"
            />

            <div class="ml-12">
                <InputSanitaryOpenAirDefecation
                    v-model="input.sanitary.open_air_defecation"
                />
                <div class="mt-2 mb-1">
                    <InputSanitaryToiletTypes
                        v-if="input.sanitary.working_toilets === 1"
                        v-model="input.sanitary.toilet_types"
                    />
                </div>
                <InputSanitaryToiletsAreInside
                    v-if="
                        input.sanitary.working_toilets === 1 &&
                            input.sanitary.toilet_types.length > 0 &&
                            notOnlyLatrines
                    "
                    v-model="input.sanitary.toilets_are_inside"
                />
                <InputSanitaryToiletsAreLighted
                    v-if="
                        input.sanitary.working_toilets === 1 &&
                            input.sanitary.toilet_types.length > 0 &&
                            notOnlyLatrines
                    "
                    v-model="input.sanitary.toilets_are_lighted"
                />
                <InputSanitaryHandWashing
                    v-if="
                        input.sanitary.working_toilets === 1 &&
                            input.sanitary.toilet_types.length > 0 &&
                            notOnlyLatrines
                    "
                    v-model="input.sanitary.hand_washing"
                />
            </div>
        </FormParagraph>

        <FormParagraph
            title="Les habitants ont-ils accès à l'électricité ?"
            :showMandatoryStar="true"
        >
            <InputElectricityAccess v-model="input.electricity.access" />

            <div class="ml-12">
                <InputElectricityAccessTypes
                    v-if="input.electricity.access === 1"
                    v-model="input.electricity.access_types"
                />
                <InputElectricityAccessIsUnequal
                    v-if="
                        input.electricity.access === 1 &&
                            input.electricity.access_types.length > 0
                    "
                    v-model="input.electricity.access_is_unequal"
                />
            </div>
        </FormParagraph>

        <FormParagraph
            title="Le ramassage des déchets est-il organisé ?"
            :showMandatoryStar="true"
        >
            <InputTrashIsPiling v-model="input.trash.is_piling" />
            <InputTrashEvacuationIsClose
                v-model="input.trash.evacuation_is_close"
            />

            <div class="ml-12">
                <InputTrashEvacuationIsSafe
                    v-model="input.trash.evacuation_is_safe"
                    v-if="input.trash.evacuation_is_close === 1"
                />
                <InputTrashEvacuationIsRegular
                    v-model="input.trash.evacuation_is_regular"
                    v-if="input.trash.evacuation_is_close === 1"
                />
                <InputTrashBulkyIsPiling
                    v-model="input.trash.bulky_is_piling"
                    v-if="input.trash.evacuation_is_close === 1"
                />
            </div>
        </FormParagraph>

        <FormParagraph
            title="Y a-t-il des nuisibles sur le site ou à proximité ?"
            :showMandatoryStar="true"
        >
            <InputPestAnimals v-model="input.pest_animals.presence" />
            <InputPestAnimalsComments v-model="input.pest_animals.details" />
        </FormParagraph>

        <FormParagraph
            title="Un diagnostic prévention incendie a-t-il été réalisé par le SDIS (Service départemental d'incendie et de secours) ?"
            :showMandatoryStar="true"
        >
            <InputFirePrevention v-model="input.fire_prevention.diagnostic" />
        </FormParagraph>
    </FormGroup>
</template>

<script>
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
import InputSanitaryOpenAirDefecation from "./inputs/InputSanitaryOpenAirDefecation.vue";
import InputSanitaryWorkingToilets from "./inputs/InputSanitaryWorkingToilets.vue";
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

export default {
    components: {
        InputWaterAccessType,
        InputWaterAccessTypeDetails,
        InputWaterAccessIsPublic,
        InputWaterAccessIsContinuous,
        InputWaterAccessIsContinuousDetails,
        InputWaterAccessIsLocal,
        InputWaterAccessIsClose,
        InputWaterAccessIsUnequal,
        InputWaterAccessIsUnequalDetails,
        InputWaterAccessHasStagnantWater,
        InputWaterAccessComments,
        InputSanitaryOpenAirDefecation,
        InputSanitaryWorkingToilets,
        InputSanitaryToiletTypes,
        InputSanitaryToiletsAreInside,
        InputSanitaryToiletsAreLighted,
        InputSanitaryHandWashing,
        InputElectricityAccess,
        InputElectricityAccessTypes,
        InputElectricityAccessIsUnequal,
        InputTrashIsPiling,
        InputTrashEvacuationIsClose,
        InputTrashEvacuationIsSafe,
        InputTrashEvacuationIsRegular,
        InputTrashBulkyIsPiling,
        InputPestAnimals,
        InputPestAnimalsComments,
        InputFirePrevention
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
    },

    computed: {
        notOnlyLatrines() {
            return (
                this.input.sanitary.toilet_types.length > 1 ||
                !this.input.sanitary.toilet_types.includes("latrines")
            );
        }
    }
};
</script>
