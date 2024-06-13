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
            <InputProcedureDatepicker
                v-if="values.justice_rendered === 1"
                name="justice_rendered_at"
                id="justice_rendered_at"
                :label="labels.justice_rendered_at"
                :minDate="values.built_at || undefined"
                :maxDate="new Date()"
                showMandatoryStar
                v-model="values.justice_rendered_at"
            />
            <InputJusticeRenderedBy v-if="values.justice_rendered === 1" />
            <InputJusticeChallenged v-if="values.justice_rendered === 1" />
        </Fieldset>

        <Fieldset
            :legend="labels.evacuation_under_time_limit"
            showMandatoryStar
        >
            <InputCheckableGroup
                name="evacuation_under_time_limit"
                :items="yesNoItems"
                model="values.evacuation_under_time_limit"
            />
            <InputProcedureDatepicker
                v-if="values.evacuation_under_time_limit === 1"
                name="administrative_order_decision_at"
                id="administrative_order_decision_at"
                :label="labels.administrative_order_decision_at"
                :minDate="values.built_at || undefined"
                :maxDate="new Date()"
                v-model="values.administrative_order_decision_at"
            />
            <InputAdministrativeOrderDecisionRenderedBy
                v-if="values.evacuation_under_time_limit === 1"
            />
            <InputProcedureDatepicker
                v-if="values.evacuation_under_time_limit === 1"
                name="administrative_order_evacuation_at"
                id="administrative_order_evacuation_at"
                :label="labels.administrative_order_evacuation_at"
                :minDate="values.built_at || undefined"
                :maxDate="new Date()"
                v-model="values.administrative_order_evacuation_at"
            />
        </Fieldset>

        <Fieldset :legend="labels.insalubrity_order" showMandatoryStar>
            <InputCheckableGroup
                name="insalubrity_order"
                :items="yesNoItems"
                model="values.insalubrity_order"
            />
            <InputInsalubrityOrderDisplayed
                v-if="values.insalubrity_order === 1"
                showMandatoryStar
            />
            <InputInsalubrityOrderType v-if="values.insalubrity_order === 1" />
            <InputInsalubrityOrderBy v-if="values.insalubrity_order === 1" />
            <InputProcedureDatepicker
                v-if="values.insalubrity_order === 1"
                name="insalubrity_order_at"
                id="insalubrity_order_at"
                :label="labels.insalubrity_order_at"
                :minDate="values.built_at || undefined"
                :maxDate="new Date()"
                v-model="values.insalubrity_order_at"
            />
            <InputInsalubrityParcels v-if="values.insalubrity_order === 1" />
        </Fieldset>

        <template v-if="policeInformationRequested === true">
            <Fieldset :legend="labels.police_status" showMandatoryStar>
                <InputCheckableGroup
                    name="police_status"
                    :items="policeItems"
                    model="values.police_status"
                />
                <InputProcedureDatepicker
                    v-if="policeRequested || policeRefused"
                    name="police_requested_at"
                    id="police_requested_at"
                    :label="labels.police_requested_at"
                    :minDate="values.built_at || undefined"
                    :maxDate="new Date()"
                    showMandatoryStar
                    modelName="values.police_requested_at"
                />
                <InputProcedureDatepicker
                    v-if="policeGranted"
                    name="police_granted_at"
                    id="police_granted_at"
                    :label="labels.police_granted_at"
                    :minDate="values.police_requested_at"
                    :maxDate="new Date()"
                    showMandatoryStar
                    modelName="values.police_granted_at"
                />
                <InputExistingLitigation />
                <InputBailiff />
            </Fieldset>
        </template>
    </FormSection>
</template>

<script setup>
import { computed, toRefs, watchEffect } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import { Button, Fieldset } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";

import InputCheckableGroup from "../inputs/common/InputCheckableGroup.vue";

import InputOwnerComplaint from "../inputs/FormDeclarationDeSiteInputOwnerComplaint.vue";

import InputJusticeProcedure from "../inputs/FormDeclarationDeSiteInputJusticeProcedure.vue";
import InputJusticeRendered from "../inputs/FormDeclarationDeSiteInputJusticeRendered.vue";
import InputProcedureDatepicker from "../inputs/common/InputDeclarationDeSiteDatepickerInput.vue";
import InputJusticeRenderedBy from "../inputs/FormDeclarationDeSiteInputJusticeRenderedBy.vue";
import InputJusticeChallenged from "../inputs/FormDeclarationDeSiteInputJusticeChallenged.vue";

import InputExistingLitigation from "../inputs/FormDeclarationDeSiteInputExistingLitigation.vue";

import InputBailiff from "../inputs/FormDeclarationDeSiteInputBailiff.vue";

import InputAdministrativeOrderDecisionRenderedBy from "../inputs/FormDeclarationDeSiteInputProcedureDecisionRenderedBy.vue";
import InputInsalubrityOrderDisplayed from "../inputs/FormDeclarationDeSiteInputInsalubrityOrderDisplayed.vue";
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

watchEffect(() => {
    if (values.value.police_status === "null") {
        values.value.existing_litigation = -1;
        values.value.bailiff = "";
    }
});
</script>
