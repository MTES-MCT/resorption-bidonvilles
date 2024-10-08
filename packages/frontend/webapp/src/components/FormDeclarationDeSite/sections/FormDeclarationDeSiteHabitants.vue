<template>
    <FormSection id="habitants">
        <template v-slot:title>Habitants</template>

        <Fieldset legend="Combien d'habitants vivent sur le site ?">
            <InputPopulation />
        </Fieldset>

        <Fieldset legend="Quelle est l'origine des habitants ?">
            <InputSocialOrigins />
        </Fieldset>

        <Fieldset
            legend="Combien y a-t-il de caravanes, d'habitats autoconstruits, de tentes, de voitures dortoir et de matelas sur le site ?"
        >
            <InputCaravans />
        </Fieldset>

        <Fieldset
            legend="Quel est le statut du diagnostic social ?"
            showMandatoryStar
        >
            <InputCensusStatus />
            <template v-if="censusStatusIsNotUnknown">
                <InputCensusConductedAt width="w-64" />
                <InputCensusConductedBy />
            </template>
        </Fieldset>

        <Fieldset
            legend="Tout ou partie des habitants viennent-ils d'un ou plusieurs sites du territoire ?"
            showMandatoryStar
        >
            <InputIsReinstallation />

            <div class="ml-12" v-if="values.is_reinstallation === 1">
                <InputReinstallationComments />

                <InputShantytowns
                    v-if="location?.departement"
                    :departement="location.departement"
                    :id="townId"
                />
                <p v-else>
                    <InputLabel
                        label="Site(s) d'origine des habitant(e)s"
                        info="Vous pourrez sélectionner ici le ou les sites d'origine des habitant(e)s, une fois le champ Adresse rempli"
                    />
                </p>
            </div>
        </Fieldset>
    </FormSection>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useFormValues } from "vee-validate";
import { Fieldset, InputLabel } from "@resorptionbidonvilles/ui";
import FormSection from "@/components/FormSection/FormSection.vue";
import InputPopulation from "../inputs/FormDeclarationDeSiteInputPopulation.vue";
import InputSocialOrigins from "../inputs/FormDeclarationDeSiteInputSocialOrigins.vue";
import InputCaravans from "../inputs/FormDeclarationDeSiteInputCaravans.vue";
import InputCensusStatus from "../inputs/FormDeclarationDeSiteInputCensusStatus.vue";
import InputCensusConductedAt from "../inputs/FormDeclarationDeSiteInputCensusConductedAt.vue";
import InputCensusConductedBy from "../inputs/FormDeclarationDeSiteInputCensusConductedBy.vue";
import InputIsReinstallation from "../inputs/FormDeclarationDeSiteInputIsReinstallation.vue";
import InputReinstallationComments from "../inputs/FormDeclarationDeSiteInputReinstallationComments.vue";
import InputShantytowns from "../inputs/FormDeclarationDeSiteInputShantytowns.vue";

const values = useFormValues();
const censusStatusIsNotUnknown = computed(() => {
    return ["done", "scheduled"].includes(values.value.census_status);
});

const props = defineProps({
    location: {
        type: Object,
        required: true,
        default: null,
    },
    townId: {
        type: Number,
        required: false,
        default: undefined,
    },
});
const { location, townId } = toRefs(props);
</script>
