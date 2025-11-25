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
                hint="Format attendu : nom@domaine.fr"
            />
            <FormUtilisateurInputEmailConfirmation
                v-if="['demande-acces', 'demande-contact'].includes(variant)"
                :label="labels.verif_email"
            />
            <FormUtilisateurInputLastName
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.last_name"
                :autocomplete="last_name"
            />
            <FormUtilisateurInputFirstName
                :showMandatoryStar="variant === 'creer-utilisateur'"
                :label="labels.first_name"
                :autocomplete="first_name"
            />
            <FormUtilisateurInputPhone
                :label="labels.phone"
                :autocomplete="tel"
            />
            <FormUtilisateurInputRequestType
                v-if="variant === 'demande-contact'"
                :class="{ hidden: demandeAccesOnly }"
                :label="labels.request_type"
                :language="language"
            />
            <section
                v-if="
                    (values.request_type &&
                        values.request_type.includes('access-request')) ||
                    ['creer-utilisateur', 'demande-acces'].includes(variant)
                "
            >
                <p class="font-bold text-xl">
                    <slot name="structureTitle" />
                </p>
                <FormUtilisateurInputStructure
                    :label="labels.organization_category"
                    @change="onOrganizationChange"
                />
            </section>
            <div
                class="ml-10 mb-4"
                v-if="values.organization_category === 'other'"
            >
                <FormUtilisateurInputOrganizationOther
                    :label="labels.organization_other"
                />
                <FormUtilisateurInputOrganizationOtherAcronyme
                    :label="labels.organization_other_acronyme"
                />
                <FormUtilisateurInputOrganizationOtherTerritory
                    :label="labels.organization_other_territory"
                />
            </div>
            <FormUtilisateurInputPosition
                v-if="
                    values.is_actor === true ||
                    ['creer-utilisateur', 'demande-acces'].includes(variant)
                "
                :label="labels.position"
            />
            <FormUtilisateurInputMessage
                v-if="['demande-acces', 'demande-contact'].includes(variant)"
                :label="labels.access_request_message"
            />
            <FormUtilisateurInputReferral
                v-if="['demande-acces', 'demande-contact'].includes(variant)"
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

        <template v-slot:button="{ disabled }">
            <p class="text-center">
                <DsfrButton :disabled="disabled" type="submit"
                    ><slot name="submit"
                /></DsfrButton>
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
// utils
import { defineProps, toRefs, computed, ref, onMounted, watch } from "vue";
import router from "@/helpers/router";

// components
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormUtilisateurInputEmail from "./inputs/FormUtilisateurInputEmail.vue";
import FormUtilisateurInputEmailConfirmation from "./inputs/FormUtilisateurInputEmailConfirmation.vue";
import FormUtilisateurInputFirstName from "./inputs/FormUtilisateurInputFirstName.vue";
import FormUtilisateurInputLastName from "./inputs/FormUtilisateurInputLastName.vue";
import FormUtilisateurInputPhone from "./inputs/FormUtilisateurInputPhone.vue";
import FormUtilisateurInputRequestType from "./inputs/FormUtilisateurInputRequestType.vue";
import FormUtilisateurInputStructure from "./inputs/FormUtilisateurInputStructure.vue";
import FormUtilisateurInputOrganizationOther from "./inputs/FormUtilisateurInputOrganizationOther.vue";
import FormUtilisateurInputOrganizationOtherAcronyme from "./inputs/FormUtilisateurInputOrganizationOtherAcronyme.vue";
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
        type: String, // soit "demande-acces", soit "demande-contact", soit "creer-utilisateur"
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
        form.value.setFieldValue("request_type", "access-request");
    }
});

watch(values.value.association, (newAssociation) => {
    onOrganizationChange(newAssociation);
});

const onOrganizationChange = (value) => {
    if (value === undefined) {
        form.value.setFieldValue("organisation", null);
        form.value.setFieldValue("organization_category", "");
        form.value.setFieldValue("territorial_collectivity", "");
        form.value.setFieldValue("association", "");
        form.value.setFieldValue("private_organization", "");
        return;
    }
    if (value?.data !== null) {
        form.value.setFieldValue("organization_category", value.data.category);
        form.value.setFieldValue(value.data.category, value);
    } else if (value?.data === null) {
        if (allowNewOrganization.value === true) {
            form.value.setFieldValue("organization_category", "other");
        } else {
            alert(
                "Vous devez créer une nouvelle structure ou en faire la demande aux administrateurs nationaux."
            );
        }
    }
};

function intermediateSubmit(values) {
    const formattedValues = { ...values };
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
        const category =
            formattedValues.organisation.data.category?.toLowerCase();
        formattedValues.organization_category = category;
        formattedValues.organisation = formattedValues.organisation.data.id;
        if (category === "association") {
            formattedValues.association = formattedValues.organisation;
        } else if (category === "private_organization") {
            formattedValues.private_organization = formattedValues.organisation;
        } else if (category === "territorial_collectivity") {
            formattedValues.territorial_collectivity =
                formattedValues.organisation;
        } else if (category === "administration") {
            formattedValues.organization_administration =
                formattedValues.organisation;
        } else if (category === "public_establishment") {
            formattedValues.organization_public = formattedValues.organisation;
        }

        delete formattedValues.organisation;
    }
    return submit.value(formattedValues);
}
</script>
