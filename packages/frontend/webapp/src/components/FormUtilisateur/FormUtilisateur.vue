<template>
    <FormPublic :schema="schema" :submit="intermediateSubmit" ref="form">
        <template v-slot:subtitle><slot name="subtitle" /></template>
        <template v-slot:title><slot name="title" /></template>

        <template v-slot:body="{ values }">
            <FormUtilisateurInputEmail
                :value="$route.query.email"
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.email"
            />
            <FormUtilisateurInputEmailConfirmation
                v-if="variant === 'demande-acces'"
                :label="labels.verif_email"
            />
            <FormUtilisateurInputFirstName
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.first_name"
            />
            <FormUtilisateurInputLastName
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.last_name"
            />
            <FormUtilisateurInputPhone :label="labels.phone" />
            <FormUtilisateurInputRequestType
                v-if="variant === 'demande-acces'"
                :label="labels.request_type"
            />
            <FormUtilisateurInputIsActor
                v-if="
                    values.request_type &&
                    values.request_type.includes('access-request')
                "
                :label="labels.is_actor"
            />
            <section
                v-if="
                    values.is_actor === true || variant === 'creer-utilisateur'
                "
            >
                <h1 class="font-bold text-xl">
                    <slot name="structureTitle" />
                </h1>
                <FormUtilisateurInputOrganizationCategory
                    :showMandatoryStar="variant === 'creer-utilisateur'"
                    :label="labels.organization_category"
                />

                <!-- Services de l'état -->
                <template
                    v-if="
                        values.organization_category === 'public_establishment'
                    "
                >
                    <FormUtilisateurInputOrganizationType
                        :label="labels.organization_type"
                    />
                    <FormUtilisateurInputOrganizationPublic
                        v-if="values.organization_type"
                        :label="labels.organization_public"
                    />
                </template>

                <!-- Collectivités -->
                <template
                    v-if="
                        values.organization_category ===
                        'territorial_collectivity'
                    "
                >
                    <FormUtilisateurInputTerritorialCollectivity
                        :label="labels.territorial_collectivity"
                    />
                </template>

                <!-- Associations -->
                <template v-if="values.organization_category === 'association'">
                    <FormUtilisateurInputAssociation
                        :label="labels.association"
                    />
                    <template v-if="values.association === 'autre'">
                        <FormUtilisateurInputNewAssociationName
                            :label="labels.new_association_name"
                        />
                        <FormUtilisateurInputNewAssociationAbbreviation
                            :label="labels.new_association_abbreviation"
                        />
                    </template>
                    <FormUtilisateurInputDepartement
                        v-if="values.association"
                        :label="labels.departement"
                    />
                </template>

                <!-- Administrations centrales -->
                <template
                    v-if="values.organization_category === 'administration'"
                >
                    <FormUtilisateurInputOrganizationAdministration
                        :label="labels.organization_administration"
                    />
                </template>

                <FormUtilisateurInputPosition
                    v-if="values.organization_category"
                    :label="labels.position"
                />
            </section>

            <FormUtilisateurInputMessage
                v-if="variant === 'demande-acces'"
                :label="labels.access_request_message"
            />
            <FormUtilisateurInputReferral
                v-if="variant === 'demande-acces'"
                :label="labels.referral"
            />
            <FormUtilisateurInputReferralOther
                v-if="values.referral === 'other'"
                :label="labels.referral_other"
            />
            <FormUtilisateurInputReferralWordOfMouth
                v-if="values.referral === 'word_of_mouth'"
                :label="labels.referral_word_of_mouth"
            />
            <FormUtilisateurInputLegal :label="labels.legal" />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <Button type="submit"><slot name="submit" /></Button>
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
// utils
import { defineProps, toRefs, computed, ref, onMounted } from "vue";
import router from "@/helpers/router";

// components
import { Button } from "@resorptionbidonvilles/ui";
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormUtilisateurInputEmail from "./inputs/FormUtilisateurInputEmail.vue";
import FormUtilisateurInputEmailConfirmation from "./inputs/FormUtilisateurInputEmailConfirmation.vue";
import FormUtilisateurInputFirstName from "./inputs/FormUtilisateurInputFirstName.vue";
import FormUtilisateurInputLastName from "./inputs/FormUtilisateurInputLastName.vue";
import FormUtilisateurInputPhone from "./inputs/FormUtilisateurInputPhone.vue";
import FormUtilisateurInputRequestType from "./inputs/FormUtilisateurInputRequestType.vue";
import FormUtilisateurInputIsActor from "./inputs/FormUtilisateurInputIsActor.vue";
import FormUtilisateurInputOrganizationCategory from "./inputs/FormUtilisateurInputOrganizationCategory.vue";
import FormUtilisateurInputOrganizationType from "./inputs/FormUtilisateurInputOrganizationType.vue";
import FormUtilisateurInputOrganizationPublic from "./inputs/FormUtilisateurInputOrganizationPublic.vue";
import FormUtilisateurInputTerritorialCollectivity from "./inputs/FormUtilisateurInputTerritorialCollectivity.vue";
import FormUtilisateurInputAssociation from "./inputs/FormUtilisateurInputAssociation.vue";
import FormUtilisateurInputNewAssociationName from "./inputs/FormUtilisateurInputNewAssociationName.vue";
import FormUtilisateurInputNewAssociationAbbreviation from "./inputs/FormUtilisateurInputNewAssociationAbbreviation.vue";
import FormUtilisateurInputDepartement from "./inputs/FormUtilisateurInputDepartement.vue";
import FormUtilisateurInputOrganizationAdministration from "./inputs/FormUtilisateurInputOrganizationAdministration.vue";
import FormUtilisateurInputPosition from "./inputs/FormUtilisateurInputPosition.vue";
import FormUtilisateurInputMessage from "./inputs/FormUtilisateurInputMessage.vue";
import FormUtilisateurInputReferral from "./inputs/FormUtilisateurInputReferral.vue";
import FormUtilisateurInputReferralOther from "./inputs/FormUtilisateurInputReferralOther.vue";
import FormUtilisateurInputReferralWordOfMouth from "./inputs/FormUtilisateurInputReferralWordOfMouth.vue";
import FormUtilisateurInputLegal from "./inputs/FormUtilisateurInputLegal.vue";

// form
import schemaFn from "./FormUtilisateur.schema";
import labelsFn from "./FormUtilisateur.labels";

const props = defineProps({
    variant: {
        type: String, // soit "demande-acces", soit "creer-utilisateur"
        required: true,
    },
    submit: {
        type: Function,
        required: true,
    },
});
const form = ref(null);
const { variant, submit } = toRefs(props);
const schema = computed(() => {
    return schemaFn(variant.value);
});
const labels = computed(() => {
    return labelsFn(variant.value);
});

onMounted(() => {
    const { acces } = router.currentRoute.value.query;
    if (acces !== undefined) {
        form.value.setFieldValue("request_type", ["access-request"]);
    }
});

function intermediateSubmit(values) {
    const formattedValues = { ...values };
    formattedValues.territorial_collectivity =
        formattedValues.territorial_collectivity?.data;
    return submit.value(formattedValues);
}
</script>
