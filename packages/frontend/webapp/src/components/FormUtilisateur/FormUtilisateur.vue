<template>
    <FormPublic
        :schema="schema"
        :submit="intermediateSubmit"
        :language="language"
        ref="form"
    >
        <template v-slot:subtitle><slot name="subtitle" /></template>
        <template v-slot:title><slot name="title" /></template>
        <template v-slot:alert><slot name="alert" /></template>

        <template v-slot:body="{ values }">
            <IndicationCaractereObligatoire
                v-if="variant === 'creer-utilisateur'"
            />
            <FormUtilisateurInputEmail
                :value="$route.query.email"
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.email"
                :aria-label="labels.aria_email"
                :autocomplete="email"
            />
            <FormUtilisateurInputEmailConfirmation
                v-if="variant === 'demande-acces'"
                :label="labels.verif_email"
            />
            <FormUtilisateurInputFirstName
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.first_name"
                :autocomplete="given-name"
            />
            <FormUtilisateurInputLastName
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.last_name"
                :autocomplete="family-name"
            />
            <FormUtilisateurInputPhone
                :label="labels.phone"
                :autocomplete="tel"
            />
            <FormUtilisateurInputRequestType
                v-if="variant === 'demande-acces'"
                :class="{ hidden: demandeAccesOnly }"
                :label="labels.request_type"
                :language="language"
            />
            <FormUtilisateurInputIsActor
                v-if="
                    values.request_type &&
                    values.request_type.includes('access-request')
                "
                :class="{ hidden: demandeAccesOnly }"
                :label="labels.is_actor"
            />
            <section
                v-if="
                    values.is_actor === true || variant === 'creer-utilisateur'
                "
            >
                <p class="font-bold text-xl">
                    <slot name="structureTitle" />
                </p>
                <FormUtilisateurInputStructure
                :label="labels.organization_category"
                @change="onOrganizationChange"
                ref="organisationInput"
                />
            </section>
            <FormUtilisateurInputOrganizationOther
                v-if="values.organization_category === 'other'"
                :label="labels.organization_other"
            />
            <FormUtilisateurInputOrganizationOtherTerritory
                v-if="values.organization_category === 'other'"
                :label="labels.organization_other_territory"
            />
            <FormUtilisateurInputPosition
                v-if="
                    values.is_actor === true || variant === 'creer-utilisateur'
                "
            :label="labels.position"
            /> 
            <FormUtilisateurInputMessage
                v-if="variant === 'demande-acces'"
                :label="labels.access_request_message"
            />
            <FormUtilisateurInputReferral
                v-if="variant === 'demande-acces'"
                :label="labels.referral"
                :language="language"
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
import { defineProps, toRefs, computed, ref, onMounted, watch } from "vue";
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
import FormUtilisateurInputStructure from "./inputs/FormUtilisateurInputStructure.vue";
import FormUtilisateurInputOrganizationOther from "./inputs/FormUtilisateurInputOrganizationOther.vue";
import FormUtilisateurInputOrganizationOtherTerritory from "./inputs/FormUtilisateurInputOrganizationOtherTerritory.vue";
import FormUtilisateurInputPosition from "./inputs/FormUtilisateurInputPosition.vue";
import FormUtilisateurInputMessage from "./inputs/FormUtilisateurInputMessage.vue";
import FormUtilisateurInputReferral from "./inputs/FormUtilisateurInputReferral.vue";
import FormUtilisateurInputReferralOther from "./inputs/FormUtilisateurInputReferralOther.vue";
import FormUtilisateurInputReferralWordOfMouth from "./inputs/FormUtilisateurInputReferralWordOfMouth.vue";
import FormUtilisateurInputLegal from "./inputs/FormUtilisateurInputLegal.vue";
import IndicationCaractereObligatoire from "@/components/IndicationCaractereObligatoire/IndicationCaractereObligatoire.vue";

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
    language: {
        type: String,
        default: "fr",
    },
});

const form = ref(null);
const organisationInput = ref(null);
const organizationInput = ref(null);
const { variant, submit, language } = toRefs(props);
const values = ref({
    organization_category: "",
    territorial_collectivity: "",
    association: "",
    private_organization: "",
});
const allowNewOrganization = computed(() => {
    return variant.value === "demande-acces";
});
const allowPrivateOrganization = computed(() => {
    return variant.value === "creer-utilisateur";
});

const schema = computed(() => {
    return schemaFn(
        variant.value,
        allowNewOrganization.value,
        allowPrivateOrganization.value,
        language.value
    );
});

const labels = computed(() => {
    return labelsFn(variant.value)[language.value];
});
const demandeAccesOnly = computed(() => {
    const { acces } = router.currentRoute.value.query;
    return variant.value === "demande-acces" && acces !== undefined;
});

onMounted(() => {
    if (demandeAccesOnly.value === true) {
        form.value.setFieldValue("is_actor", true);
        form.value.setFieldValue("request_type", ["access-request"]);
    }
});

watch(values.value.association, (newAssociation) => {
    onOrganizationChange(newAssociation);
});
function onOrganizationChange(value) {
    if (value?.data === null) {
        if (allowNewOrganization.value === true) {
            form.value.setFieldValue("organization_category", "other");
        } else {
            alert(
                "Vous devez créer une nouvelle structure ou en faire la demande aux administrateurs nationaux."
            );
        }

        organizationInput.value.clear();
    }
}

function intermediateSubmit(values) {
    const formattedValues = { ...values };
    console.log("intermediateSubmit", formattedValues);
    formattedValues.territorial_collectivity = formattedValues
        .territorial_collectivity?.data
        ? formattedValues.territorial_collectivity.data.id
        : null;

    formattedValues.association = formattedValues.association?.data
        ? formattedValues.association.data.id
        : null;

    formattedValues.private_organization = formattedValues.private_organization
        ?.data
        ? formattedValues.private_organization.data.id
        : null;

    if (formattedValues.organisation && formattedValues.organisation.data) {
        const category = formattedValues.organisation.data.category?.toLowerCase();
        formattedValues.organization_category = category;
        formattedValues.organisation = formattedValues.organisation.data.id;
        if (category === "association") {
            formattedValues.association = formattedValues.organisation;
        } else if (category === "private_organization") {
            formattedValues.private_organization = formattedValues.organisation;
        } else if (category === "territorial_collectivity") {
            formattedValues.territorial_collectivity = formattedValues.organisation;
        } else if (category === "administration") {
            formattedValues.organization_administration = formattedValues.organisation;
        } else if (category === "public_establishment") {
            formattedValues.organization_public = formattedValues.organisation;
        }

        delete formattedValues.organisation;
    }
    return submit.value(formattedValues);
}
</script>
