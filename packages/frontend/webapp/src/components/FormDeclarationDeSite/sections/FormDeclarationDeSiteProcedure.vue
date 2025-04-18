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
        <Fieldset
            :legend="labels.owner_complaint"
            showMandatoryStar
            class="mb-4"
        >
            <InputOwnerComplaint />
        </Fieldset>

        <Fieldset
            :legend="labels.justice_procedure"
            showMandatoryStar
            class="mb-4"
        >
            <InputJusticeProcedure />
            <div class="ml-12">
                <InputJusticeRendered v-if="values.justice_procedure === 1" />
                <div class="ml-8" v-if="values.justice_rendered === 1">
                    <InputProcedureDatepicker
                        name="justice_rendered_at"
                        id="justice_rendered_at"
                        :label="labels.justice_rendered_at"
                        :minDate="values.built_at || undefined"
                        :maxDate="new Date()"
                        showMandatoryStar
                        v-model="values.justice_rendered_at"
                    />
                    <UploadArrete
                        type="justice_rendered"
                        v-if="values.justice_rendered === 1"
                        v-model="values"
                        :townId="townId"
                        @update:attachments="updateAttachments"
                        @delete:OriginalAttachment="deleteOriginalAttachment"
                        class="mb-4"
                    />
                    <InputJusticeRenderedBy />
                    <InputJusticeChallenged />
                </div>
            </div>
        </Fieldset>

        <Fieldset
            :legend="labels.evacuation_under_time_limit"
            showMandatoryStar
            :class="[
                { 'mb-4': values.evacuation_under_time_limit !== 1 },
                { 'mb-12': values.evacuation_under_time_limit === 1 },
            ]"
        >
            <InputCheckableGroup
                name="evacuation_under_time_limit"
                :items="yesNoItems"
                model="values.evacuation_under_time_limit"
            />
            <div class="ml-12" v-if="values.evacuation_under_time_limit === 1">
                <InputProcedureDatepicker
                    name="administrative_order_decision_at"
                    id="administrative_order_decision_at"
                    :label="labels.administrative_order_decision_at"
                    :minDate="values.built_at || undefined"
                    :maxDate="new Date()"
                    v-model="values.administrative_order_decision_at"
                />
                <InputAdministrativeOrderDecisionRenderedBy />
                <InputProcedureDatepicker
                    name="administrative_order_evacuation_at"
                    id="administrative_order_evacuation_at"
                    :label="labels.administrative_order_evacuation_at"
                    :minDate="values.built_at || undefined"
                    :maxDate="new Date()"
                    v-model="values.administrative_order_evacuation_at"
                />
                <UploadArrete
                    type="evacuation"
                    v-model="values"
                    :townId="townId"
                    @update:attachments="updateAttachments"
                    @delete:OriginalAttachment="deleteOriginalAttachment"
                />
            </div>
        </Fieldset>

        <Fieldset
            :legend="labels.insalubrity_order"
            showMandatoryStar
            :class="[
                { 'mb-4': values.insalubrity_order !== 1 },
                { 'mb-12': values.insalubrity_order === 1 },
            ]"
        >
            <InputCheckableGroup
                name="insalubrity_order"
                :items="yesNoItems"
                model="values.insalubrity_order"
            />
            <div v-if="values.insalubrity_order === 1" class="ml-12">
                <InputInsalubrityOrderDisplayed showMandatoryStar />
                <InputInsalubrityOrderType />
                <InputInsalubrityOrderBy />
                <InputProcedureDatepicker
                    v-if="values.insalubrity_order === 1"
                    name="insalubrity_order_at"
                    id="insalubrity_order_at"
                    :label="labels.insalubrity_order_at"
                    :minDate="values.built_at || undefined"
                    :maxDate="new Date()"
                    v-model="values.insalubrity_order_at"
                />
                <InputInsalubrityParcels />
                <UploadArrete
                    type="insalubrity"
                    v-if="values.insalubrity_order === 1"
                    v-model="values"
                    :townId="townId"
                    @update:attachments="updateAttachments"
                    @delete:OriginalAttachment="deleteOriginalAttachment"
                />
            </div>
        </Fieldset>

        <template v-if="policeInformationRequested === true">
            <Fieldset :legend="labels.police_status" showMandatoryStar>
                <InputCheckableGroup
                    name="police_status"
                    :items="policeItems"
                    model="values.police_status"
                />
                <div class="ml-12 mb-12">
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
                </div>
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
import UploadArrete from "../inputs/FormDeclarationDeSiteUploadArrete.vue";

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
    townId: Number,
});
const { location, mode, townId } = toRefs(props);

const emit = defineEmits(["delete:OriginalAttachment"]);

const values = useFormValues();

const updateAttachments = ({ type, files }) => {
    const existingFiles = Array.from(values.value.attachments || []);

    const newFiles = Array.from(files).map((file) => ({
        file,
        decreeType: type,
    }));

    values.value.attachments = existingFiles.concat(newFiles);
};

const deleteOriginalAttachment = (attachments) => {
    emit("delete:OriginalAttachment", attachments);
};

const policeInformationRequested = computed(() => {
    return (
        values.value.justice_procedure === 1 ||
        values.value.evacuation_under_time_limit == 1 ||
        values.value.insalubrity_order == 1 ||
        ["requested", "granted"].includes(values.value.police_status)
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
    }
});
</script>
