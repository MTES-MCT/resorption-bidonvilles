<template>
    <FormSection id="justice">
        <template v-slot:title>
            <div class="flex justify-between">
                <div>Procédure judiciaire</div>
                <div v-if="location?.type" class="text-sm">
                    <Button
                        type="button"
                        size="sm"
                        icon="user-group"
                        iconPosition="left"
                        variant="primaryText"
                        @click="openModaleListeAccesPJ"
                    >
                        Qui aura accès aux données sur la procédure judiciaire ?
                    </Button>
                </div>
            </div>
        </template>
        <Fieldset
            legend="Une plainte a-t-elle été déposée par le propriétaire ?"
            showMandatoryStar
        >
            <InputOwnerComplaint />
        </Fieldset>

        <Fieldset
            legend="Une procédure judiciaire est-elle en cours ?"
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
        </Fieldset>
    </FormSection>
    <ModaleListeAccesPJ
        ref="modaleListeAccesPJ"
        :location="location"
        :future="future"
    />
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import { Button, Fieldset } from "@resorptionbidonvilles/ui";

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

import ModaleListeAccesPJ from "@/components/ModaleListeAccesPJ/ModaleListeAccesPJ.vue";

const props = defineProps({
    location: Object,
    mode: String,
});
const { location, mode } = toRefs(props);

const values = useFormValues();
const policeWasRequested = computed(() => {
    return ["requested", "granted"].includes(values.value.police_status);
});

const policeWasGranted = computed(() => {
    return values.value.police_status === "granted";
});

const modaleListeAccesPJ = ref(null);

const future = computed(() => {
    return mode.value !== "edit";
});

function openModaleListeAccesPJ() {
    modaleListeAccesPJ.value.open();
}
</script>
