<template>
    <FormSection id="procedure">
        <template v-slot:title>
            <div class="xl:flex xl:justify-between mb-8 lg:mb-4">
                <div>Procédure judiciaire ou administrative</div>
                <div v-if="location?.type" class="flex flex-col text-sm">
                    <Button
                        type="button"
                        size="sm"
                        icon="user-group"
                        iconPosition="left"
                        variant="primaryText"
                        @click="openModaleListeAccesPJ"
                    >
                        Qui aura accès aux procédures judiciaires ou
                        administratives ?
                    </Button>
                </div>
            </div>
        </template>
        <Fieldset :legend="labels.owner_complaint" showMandatoryStar>
            <InputOwnerComplaint />
        </Fieldset>

        <Fieldset :legend="labels.justice_procedure" showMandatoryStar>
            <InputJusticeProcedure />
            <InputJusticeRendered v-if="values.justice_procedure === 1" />
            <InputJusticeRenderedAt
                v-if="values.justice_rendered === 1"
                width="w-64"
            />
            <InputJusticeRenderedBy v-if="values.justice_rendered === 1" />
            <InputJusticeChallenged v-if="values.justice_rendered === 1" />
        </Fieldset>

        <Fieldset
            :legend="labels.evacuation_under_time_limit"
            showMandatoryStar
        >
            <InputCheckableGroup
                fieldName="evacuation_under_time_limit"
                :items="yesNoItems"
            />
            <InputAdministrativeOrderDecisionRenderedAt
                v-if="values.evacuation_under_time_limit === 1"
                width="w-64"
            />
            <InputAdministrativeOrderDecisionRenderedBy
                v-if="values.evacuation_under_time_limit === 1"
            />
            <InputAdministrativeOrderEvacuationAt
                v-if="values.evacuation_under_time_limit === 1"
                width="w-64"
            />
        </Fieldset>

        <Fieldset :legend="labels.insalubrity_order" showMandatoryStar>
            <InputCheckableGroup
                fieldName="insalubrity_order"
                :items="yesNoItems"
            />
            <InputInsalubrityOrderDisplayed
                v-if="values.insalubrity_order === 1"
                showMandatoryStar
            />
            <InputInsalubrityOrderType v-if="values.insalubrity_order === 1" />
            <InputInsalubrityOrderBy v-if="values.insalubrity_order === 1" />
            <InputInsalubrityOrderAt
                v-if="values.insalubrity_order === 1"
                width="w-64"
            />
            <InputInsalubrityParcels v-if="values.insalubrity_order === 1" />
        </Fieldset>

        <template v-if="policeInformationRequested === true">
            <Fieldset :legend="labels.police_status" showMandatoryStar>
                <InputCheckableGroup
                    fieldName="police_status"
                    :items="policeItems"
                />
                <InputPoliceRequestedAt
                    v-if="policeRequested || policeRefused"
                    fieldName="police_requested_at"
                    modelName="values.police_requested_at"
                    width="w-64"
                    showMandatoryStar
                />
                <InputPoliceGrantedAt
                    v-if="policeGranted"
                    fieldName="police_granted_at"
                    modelName="values.police_granted_at"
                    width="w-64"
                    show-mandatory-star
                />
                <InputExistingLitigation
                    v-if="policeGranted"
                    showMandatoryStar
                />
                <InputBailiff fieldName="bailiff" />
            </Fieldset>
        </template>
    </FormSection>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import { Button, Fieldset } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

import InputCheckableGroup from "../inputs/common/InputCheckableGroup.vue";

import InputOwnerComplaint from "../inputs/FormDeclarationDeSiteInputOwnerComplaint.vue";

import InputJusticeProcedure from "../inputs/FormDeclarationDeSiteInputJusticeProcedure.vue";
import InputJusticeRendered from "../inputs/FormDeclarationDeSiteInputJusticeRendered.vue";
import InputJusticeRenderedAt from "../inputs/FormDeclarationDeSiteInputJusticeRenderedAt.vue";
import InputJusticeRenderedBy from "../inputs/FormDeclarationDeSiteInputJusticeRenderedBy.vue";
import InputJusticeChallenged from "../inputs/FormDeclarationDeSiteInputJusticeChallenged.vue";

import InputPoliceRequestedAt from "../inputs/FormDeclarationDeSiteInputPoliceRequestedAt.vue";
import InputPoliceGrantedAt from "../inputs/FormDeclarationDeSiteInputPoliceGrantedAt.vue";

import InputExistingLitigation from "../inputs/FormDeclarationDeSiteInputExistingLitigation.vue";

import InputBailiff from "../inputs/FormDeclarationDeSiteInputBailiff.vue";

import InputAdministrativeOrderDecisionRenderedAt from "../inputs/FormDeclarationDeSiteInputProcedureDecisionRenderedAt.vue";
import InputAdministrativeOrderDecisionRenderedBy from "../inputs/FormDeclarationDeSiteInputProcedureDecisionRenderedBy.vue";
import InputAdministrativeOrderEvacuationAt from "../inputs/FormDeclarationDeSiteInputProcedureEvacuationAt.vue";
import InputInsalubrityOrderDisplayed from "../inputs/FormDeclarationDeSiteInputInsalubrityOrderDisplayed.vue";
import InputInsalubrityOrderAt from "../inputs/FormDeclarationDeSiteInputProcedureInsalubrityOrderAt.vue";
import InputInsalubrityOrderBy from "../inputs/FormDeclarationDeSiteInputProcedureInsalubrityOrderBy.vue";
import InputInsalubrityOrderType from "../inputs/FormDeclarationDeSiteInputProcedureInsalubrityOrderType.vue";
import InputInsalubrityParcels from "../inputs/FormDeclarationDeSiteInputInsalubrityParcels.vue";

import ModaleListeAccesPJ from "@/components/ModaleListeAccesPJ/ModaleListeAccesPJ.vue";
import { useModaleStore } from "@/stores/modale.store";

import policeItems from "@/utils/police_statuses";
import yesNoItems from "@/utils/yesNoItems";

const props = defineProps({
    location: Object,
    mode: String,
});
const { location, mode } = toRefs(props);

const values = useFormValues();

const policeInformationRequested = computed(() => {
    return (
        values.value.justice_procedure === 1 ||
        values.value.evacuation_under_time_limit == 1 ||
        values.value.insalubrity_order == 1
    );
});

const policeRequested = computed(() => {
    return ["requested", "granted"].includes(values.value.police_status);
});

const policeGranted = computed(() => {
    return values.value.police_status === "granted";
});

const policeRefused = computed(() => {
    return ["refused"].includes(values.value.police_status);
});

const future = computed(() => {
    return mode.value !== "edit";
});

function openModaleListeAccesPJ() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModaleListeAccesPJ, {
        location: location.value,
        future: future.value,
    });
}
</script>
