<template>
    <FormSection id="procedure">
        <template v-slot:title>
            <div class="flex justify-between">
                <div>Procédure judiciaire ou administrative</div>
                <div v-if="location?.type" class="text-sm">
                    <Button
                        type="button"
                        size="sm"
                        icon="user-group"
                        iconPosition="left"
                        variant="primaryText"
                        @click="openModaleListeAccesPJ"
                    >
                        Qui aura accès aux données sur la procédure ?
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

            <template v-if="values.justice_procedure === 1">
                <InputPoliceStatus fieldName="police_status" />
                <InputPoliceRequestedAt
                    v-if="policeRequestedForJustice"
                    fieldName="police_requested_at"
                    modelName="values.police_requested_at"
                    width="w-64"
                />
                <InputPoliceGrantedAt
                    v-if="policeGrantedForJustice"
                    fieldName="police_granted_at"
                    modelName="values.police_granted_at"
                    width="w-64"
                />
            </template>
            <InputBailiff fieldName="bailiff" />
        </Fieldset>

        <Fieldset
            :legend="labels.evacuation_under_time_limit"
            showMandatoryStar
        >
            <InputCheckableGroup fieldName="evacuation_under_time_limit" />
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
            <template v-if="values.evacuation_under_time_limit === 1">
                <InputPoliceStatus fieldName="evacuation_police_status" />
                <InputPoliceRequestedAt
                    v-if="policeRequestedForEvacuation"
                    fieldName="evacuation_police_requested_at"
                    modelName="values.evacuation_police_requested_at"
                    width="w-64"
                />
                <InputPoliceGrantedAt
                    v-if="policeGrantedForEvacuation"
                    fieldName="evacuation_police_granted_at"
                    modelName="values.evacuation_police_granted_at"
                    width="w-64"
                />
            </template>
            <InputBailiff
                v-if="values.evacuation_under_time_limit === 1"
                fieldName="evacuation_bailiff"
            />
        </Fieldset>

        <Fieldset :legend="labels.insalubrity_order" showMandatoryStar>
            <InputCheckableGroup fieldName="insalubrity_order" />
            <Fieldset
                :legend="labels.insalubrity_order_displayed"
                v-if="values.insalubrity_order === 1"
                showMandatoryStar
            >
                <InputCheckableGroup fieldName="insalubrity_order_displayed" />
            </Fieldset>
            <InputInsalubrityOrderType v-if="values.insalubrity_order === 1" />
            <InputInsalubrityOrderBy v-if="values.insalubrity_order === 1" />
            <InputInsalubrityOrderAt
                v-if="values.insalubrity_order === 1"
                width="w-64"
            />
            <InputInsalubrityParcels v-if="values.insalubrity_order === 1" />

            <template v-if="values.insalubrity_order === 1">
                <InputPoliceStatus fieldName="insalubrity_police_status" />
                <InputPoliceRequestedAt
                    v-if="policeRequestedForInsalubrity"
                    fieldName="insalubrity_police_requested_at"
                    modelName="values.insalubrity_police_requested_at"
                    width="w-64"
                />
                <InputPoliceGrantedAt
                    v-if="policeGrantedForInsalubrity"
                    fieldName="insalubrity_police_granted_at"
                    modelName="values.insalubrity_police_granted_at"
                    width="w-64"
                />
            </template>
            <InputBailiff
                v-if="values.insalubrity_order === 1"
                fieldName="insalubrity_bailiff"
            />
        </Fieldset>
    </FormSection>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import { Button, Fieldset } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

import InputOwnerComplaint from "../inputs/FormDeclarationDeSiteInputOwnerComplaint.vue";

import InputJusticeProcedure from "../inputs/FormDeclarationDeSiteInputJusticeProcedure.vue";
import InputJusticeRendered from "../inputs/FormDeclarationDeSiteInputJusticeRendered.vue";
import InputJusticeRenderedAt from "../inputs/FormDeclarationDeSiteInputJusticeRenderedAt.vue";
import InputJusticeRenderedBy from "../inputs/FormDeclarationDeSiteInputJusticeRenderedBy.vue";
import InputJusticeChallenged from "../inputs/FormDeclarationDeSiteInputJusticeChallenged.vue";

import InputPoliceStatus from "../inputs/common/InputPoliceStatus.vue";
import InputPoliceRequestedAt from "../inputs/common/InputPoliceRequestedAt.vue";
import InputPoliceGrantedAt from "../inputs/common/InputPoliceGrantedAt.vue";

import InputBailiff from "../inputs/common/InputBailiff.vue";

import InputAdministrativeOrderDecisionRenderedAt from "../inputs/FormDeclarationDeSiteInputProcedureDecisionRenderedAt.vue";
import InputAdministrativeOrderDecisionRenderedBy from "../inputs/FormDeclarationDeSiteInputProcedureDecisionRenderedBy.vue";
import InputAdministrativeOrderEvacuationAt from "../inputs/FormDeclarationDeSiteInputProcedureEvacuationAt.vue";
import InputCheckableGroup from "../inputs/common/InputCheckableGroup.vue";
import InputInsalubrityOrderAt from "../inputs/InputProcedureInsalubrityOrderAt.vue";
import InputInsalubrityOrderBy from "../inputs/InputProcedureInsalubrityOrderBy.vue";
import InputInsalubrityOrderType from "../inputs/InputProcedureInsalubrityOrderType.vue";
import InputInsalubrityParcels from "../inputs/InputInsalubrityParcels.vue";

import ModaleListeAccesPJ from "@/components/ModaleListeAccesPJ/ModaleListeAccesPJ.vue";
import { useModaleStore } from "@/stores/modale.store";

const props = defineProps({
    location: Object,
    mode: String,
});
const { location, mode } = toRefs(props);

const values = useFormValues();

const policeRequestedForJustice = computed(() => {
    return ["requested", "granted"].includes(values.value.police_status);
});

const policeGrantedForJustice = computed(() => {
    return values.value.police_status === "granted";
});

const policeRequestedForEvacuation = computed(() => {
    return ["requested", "granted"].includes(
        values.value.evacuation_police_status
    );
});

const policeGrantedForEvacuation = computed(() => {
    return values.value.evacuation_police_status === "granted";
});

const policeRequestedForInsalubrity = computed(() => {
    return ["requested", "granted"].includes(
        values.value.insalubrity_police_status
    );
});

const policeGrantedForInsalubrity = computed(() => {
    return values.value.insalubrity_police_status === "granted";
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
