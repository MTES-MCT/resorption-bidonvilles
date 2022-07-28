<template>
    <FormGroup title="Conditions de vie et environnement">
        <p class="bg-yellow-200 p-4 mb-6" v-if="input.original_version === 1">
            <span class="font-bold"
                >Le formulaire des conditions de vie évolue</span
            ><br />
            Le formulaire des conditions de vie évolue pour être plus précis et
            plus exhaustif sur l'accès à l'eau, l'électricité et aux toilettes.
            Les questions progressives vont permettre d'identifier le niveau
            d'accès de chaque service de base et d'indiquer les actions à mener
            sans avoir besoin d'être expert sur ces thématiques !<br />
            Pour vous aider à remplir le nouveau formulaire vous pouvez faire
            apparaître les réponses aux anciennes questions (grisées).
        </p>

        <FormParagraph
            v-if="input.original_version === 1"
            title="Souhaitez-vous remplir le nouveau formulaire des conditions de vie ?"
            :showMandatoryStar="true"
        >
            <CheckableGroup
                id="living_conditions_version"
                validationName="Souhaitez-vous remplir le nouveau formulaire des conditions de vie ?"
                direction="horizontal"
                rules="required"
            >
                <Radio
                    variant="card"
                    label="Oui"
                    v-model="input.version"
                    :checkValue="2"
                ></Radio>
                <Radio
                    variant="card"
                    label="Non"
                    v-model="input.version"
                    :checkValue="1"
                ></Radio>
            </CheckableGroup>

            <CheckableGroup
                id="show_old_living_conditions"
                label="Souhaitez-vous consulter les réponses aux anciennes questions ?"
                info="Les questions apparaîtront grisées ci-dessus en consultation uniquement"
                direction="horizontal"
                rules="required"
                :showMandatoryStar="true"
            >
                <Radio
                    variant="card"
                    label="Oui"
                    v-model="showOldLivingConditions"
                    :checkValue="true"
                ></Radio>
                <Radio
                    variant="card"
                    label="Non"
                    v-model="showOldLivingConditions"
                    :checkValue="false"
                ></Radio>
            </CheckableGroup>
        </FormParagraph>

        <template v-if="input.original_version === 2 || input.version === 2">
            <FormParagraph
                title="Comment les habitants ont-ils accès à l'eau ?"
                :showMandatoryStar="true"
            >
                <InputWaterAccessType
                    v-model="input.v2.water.access_type"
                ></InputWaterAccessType>

                <div class="ml-12">
                    <InputWaterAccessTypeDetails
                        v-if="input.v2.water.access_type === 'autre'"
                        v-model="input.v2.water.access_type_details"
                    />

                    <div
                        v-if="
                            ['robinet_connecte_au_reseau', 'autre'].includes(
                                input.v2.water.access_type
                            )
                        "
                    >
                        <InputWaterAccessIsPublic
                            v-model="input.v2.water.access_is_public"
                        />

                        <InputWaterAccessIsContinuous
                            v-if="input.v2.water.access_is_public === 0"
                            v-model="input.v2.water.access_is_continuous"
                        />
                        <div class="mt-4 ml-12">
                            <InputWaterAccessIsContinuousDetails
                                v-if="
                                    input.v2.water.access_is_public === 0 &&
                                        input.v2.water.access_is_continuous ===
                                            0
                                "
                                v-model="
                                    input.v2.water.access_is_continuous_details
                                "
                            />
                        </div>

                        <InputWaterAccessIsLocal
                            v-if="input.v2.water.access_is_public === 0"
                            v-model="input.v2.water.access_is_local"
                        />

                        <InputWaterAccessIsClose
                            v-if="
                                input.v2.water.access_is_public === 0 &&
                                    input.v2.water.access_is_local === 1
                            "
                            v-model="input.v2.water.access_is_close"
                        />

                        <InputWaterAccessIsUnequal
                            v-if="
                                input.v2.water.access_is_public === 0 &&
                                    input.v2.water.access_is_local === 1
                            "
                            v-model="input.v2.water.access_is_unequal"
                        />
                        <div class="mt-4 ml-12">
                            <InputWaterAccessIsUnequalDetails
                                v-if="
                                    input.v2.water.access_is_public === 0 &&
                                        input.v2.water.access_is_local === 1 &&
                                        input.v2.water.access_is_unequal === 1
                                "
                                v-model="
                                    input.v2.water.access_is_unequal_details
                                "
                            />
                        </div>

                        <InputWaterAccessHasStagnantWater
                            v-if="
                                input.v2.water.access_is_public === 0 &&
                                    input.v2.water.access_is_local === 1
                            "
                            v-model="input.v2.water.access_has_stagnant_water"
                        />
                    </div>
                </div>

                <div class="mt-6">
                    <InputWaterAccessComments
                        v-model="input.v2.water.access_comments"
                    ></InputWaterAccessComments>
                </div>
            </FormParagraph>

            <FormParagraph
                title="Les habitants ont-ils accès à des toilettes fonctionnelles ?"
                :showMandatoryStar="true"
            >
                <InputSanitaryWorkingToilets
                    v-model="input.v2.sanitary.working_toilets"
                />

                <div class="ml-12">
                    <InputSanitaryOpenAirDefecation
                        v-model="input.v2.sanitary.open_air_defecation"
                    />
                    <div class="mt-2 mb-1">
                        <InputSanitaryToiletTypes
                            v-if="input.v2.sanitary.working_toilets === 1"
                            v-model="input.v2.sanitary.toilet_types"
                        />
                    </div>
                    <InputSanitaryToiletsAreInside
                        v-if="
                            input.v2.sanitary.working_toilets === 1 &&
                                input.v2.sanitary.toilet_types.length > 0 &&
                                notOnlyLatrines
                        "
                        v-model="input.v2.sanitary.toilets_are_inside"
                    />
                    <InputSanitaryToiletsAreLighted
                        v-if="
                            input.v2.sanitary.working_toilets === 1 &&
                                input.v2.sanitary.toilet_types.length > 0 &&
                                notOnlyLatrines
                        "
                        v-model="input.v2.sanitary.toilets_are_lighted"
                    />
                    <InputSanitaryHandWashing
                        v-if="
                            input.v2.sanitary.working_toilets === 1 &&
                                input.v2.sanitary.toilet_types.length > 0 &&
                                notOnlyLatrines
                        "
                        v-model="input.v2.sanitary.hand_washing"
                    />
                </div>
            </FormParagraph>

            <FormParagraph
                title="Les habitants ont-ils accès à l'électricité ?"
                :showMandatoryStar="true"
            >
                <InputElectricityAccess v-model="input.v2.electricity.access" />

                <div class="ml-12">
                    <InputElectricityAccessTypes
                        v-if="input.v2.electricity.access === 1"
                        v-model="input.v2.electricity.access_types"
                    />
                    <InputElectricityAccessIsUnequal
                        v-if="
                            input.v2.electricity.access === 1 &&
                                input.v2.electricity.access_types.length > 0
                        "
                        v-model="input.v2.electricity.access_is_unequal"
                    />
                </div>
            </FormParagraph>

            <FormParagraph title="Le ramassage des déchets est-il organisé ?">
                <InputTrashIsPiling v-model="input.v2.trash.is_piling" />
                <InputTrashEvacuationIsClose
                    v-model="input.v2.trash.evacuation_is_close"
                />

                <div class="ml-12">
                    <InputTrashEvacuationIsSafe
                        v-model="input.v2.trash.evacuation_is_safe"
                        v-if="input.v2.trash.evacuation_is_close === 1"
                    />
                    <InputTrashEvacuationIsRegular
                        v-model="input.v2.trash.evacuation_is_regular"
                        v-if="input.v2.trash.evacuation_is_close === 1"
                    />
                    <InputTrashBulkyIsPiling
                        v-model="input.v2.trash.bulky_is_piling"
                        v-if="input.v2.trash.evacuation_is_close === 1"
                    />
                </div>
            </FormParagraph>

            <FormParagraph
                title="Y a-t-il des nuisibles sur le site ou à proximité ?"
                :showMandatoryStar="true"
            >
                <InputPestAnimals v-model="input.v2.pest_animals.presence" />
                <InputPestAnimalsComments
                    v-model="input.v2.pest_animals.details"
                />
            </FormParagraph>

            <FormParagraph
                title="Un diagnostic prévention incendie a-t-il été réalisé par le SDIS (Service départemental d'incendie et de secours) ?"
                :showMandatoryStar="true"
            >
                <InputFirePrevention
                    v-model="input.v2.fire_prevention.diagnostic"
                />
            </FormParagraph>
        </template>
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
        showOldLivingConditions: {
            get() {
                return this.$store.state.townForm.showOldLivingConditions;
            },
            set(value) {
                const previousScrollPosition = window.scrollY;
                const previousDocumentHeight = document.body.offsetHeight;
                this.$store.commit(
                    "townForm/SET_SHOW_OLD_LIVING_CONDITIONS",
                    value === true
                );
                this.$nextTick(() => {
                    const factor =
                        document.body.offsetHeight - previousDocumentHeight > 0
                            ? -1
                            : 1;

                    // on crée volontairement un décalage de 30px au scroll pour montrer que quelque chose a changé dans le contenu de la page
                    // sans ce décalage, on peut avoir l'impression que rien ne se passe
                    window.scrollTo(
                        window.scrollX,
                        previousScrollPosition +
                            (document.body.offsetHeight -
                                previousDocumentHeight) +
                            factor * 30
                    );
                });
            }
        },
        notOnlyLatrines() {
            return (
                this.input.v2.sanitary.toilet_types.length > 1 ||
                !this.input.v2.sanitary.toilet_types.includes("latrines")
            );
        }
    }
};
</script>
