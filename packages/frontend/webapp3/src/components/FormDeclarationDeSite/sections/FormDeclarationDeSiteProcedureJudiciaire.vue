<template>
    <FormSection id="justice">
        <template v-slot:title>Procédure judiciaire</template>

        <FormParagraph
            title="Une plainte a-t-elle été déposée par le propriétaire ?"
            showMandatoryStar
        >
            <InputOwnerComplaint />
        </FormParagraph>

        <FormParagraph
            title="Une procédure judiciaire est-elle en cours ?"
            showMandatoryStar
        >
            <InputJusticeProcedure />
            <InputJusticeRendered v-if="values.justice_procedure === 1" />
            <InputJusticeRenderedAt
                v-if="values.justice_rendered === 1"
                width="w-64"
            />
            <InputJusticeRenderedBy v-if="values.justice_rendered === 1" />
            <InputJusticeChallenged v-if="values.justice_rendered === 1" />
            <InputPoliceStatus />
            <InputPoliceRequestedAt v-if="policeWasRequested" width="w-64" />
            <InputPoliceGrantedAt v-if="policeWasGranted" width="w-64" />
            <InputBailiff />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { computed } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";

import InputOwnerComplaint from "../inputs/FormDeclarationDeSiteInputOwnerComplaint.vue";
import InputJusticeProcedure from "../inputs/FormDeclarationDeSiteInputJusticeProcedure.vue";
import InputJusticeRendered from "../inputs/FormDeclarationDeSiteInputJusticeRendered.vue";
import InputJusticeRenderedAt from "../inputs/FormDeclarationDeSiteInputJusticeRenderedAt.vue";
import InputJusticeRenderedBy from "../inputs/FormDeclarationDeSiteInputJusticeRenderedBy.vue";
import InputJusticeChallenged from "../inputs/FormDeclarationDeSiteInputJusticeChallenged.vue";
import InputPoliceStatus from "../inputs/FormDeclarationDeSiteInputPoliceStatus.vue";
import InputPoliceRequestedAt from "../inputs/FormDeclarationDeSiteInputPoliceRequestedAt.vue";
import InputPoliceGrantedAt from "../inputs/FormDeclarationDeSiteInputPoliceGrantedAt.vue";
import InputBailiff from "../inputs/FormDeclarationDeSiteInputBailiff.vue";

const values = useFormValues();
const policeWasRequested = computed(() => {
    return ["requested", "granted"].includes(values.value.police_status);
});

const policeWasGranted = computed(() => {
    return values.value.police_status === "granted";
});
</script>
