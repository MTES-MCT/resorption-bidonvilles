<template>
    <FormSection id="conditions_de_vie">
        <template v-slot:title>Conditions de vie et environnement</template>

        <template v-if="version === 1">
            <p class="bg-yellow-200 p-4 mb-6">
                <Icon icon="triangle-exclamation" class="mr-1" />
                <span class="font-bold"
                    >Le formulaire des conditions de vie évolue</span
                ><br />
                Le formulaire des conditions de vie évolue pour être plus précis
                et plus exhaustif sur l'accès à l'eau, l'électricité et aux
                toilettes. Les questions progressives vont permettre
                d'identifier le niveau d'accès de chaque service de base et
                d'indiquer les actions à mener sans avoir besoin d'être expert
                sur ces thématiques !<br />
                Pour vous aider à remplir le nouveau formulaire vous pouvez
                faire apparaître les réponses aux anciennes questions (grisées).
            </p>

            <FormParagraph
                title="Souhaitez-vous remplir le nouveau formulaire des conditions de vie ?"
                showMandatoryStar
            >
                <InputLivingConditionsVersion />
                <InputShowOldLivingConditions />
            </FormParagraph>
        </template>

        <FormDeclarationDeSiteConditionsDeVieV2
            v-if="version === 2 || values.living_conditions_version === 2"
        />
    </FormSection>
</template>

<script setup>
import { toRefs } from "vue";
import { useFormValues } from "vee-validate";
import { Icon, FormParagraph } from "@resorptionbidonvilles/ui";

import FormSection from "@/components/FormSection/FormSection.vue";
import InputLivingConditionsVersion from "../inputs/FormDeclarationDeSiteInputLivingConditionsVersion.vue";
import InputShowOldLivingConditions from "../inputs/FormDeclarationDeSiteInputShowOldLivingConditions.vue";
import FormDeclarationDeSiteConditionsDeVieV2 from "./FormDeclarationDeSiteConditionsDeVieV2.vue";

const props = defineProps({
    version: {
        type: Number,
        required: false,
        default: 2,
    },
});
const { version } = toRefs(props);

const values = useFormValues();
</script>
