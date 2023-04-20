<template>
    <FormSection id="caracteristiques">
        <template v-slot:title>Caractéristiques du site</template>

        <FormParagraph title="Quelles sont les dates clés du site ?">
            <InputBuiltAt width="w-64" />
            <InputDeclaredAt width="w-64" />
            <InputFieldType />
            <InputDetailedAddress />
        </FormParagraph>

        <FormParagraph title="Quel est le propriétaire ?" showMandatoryStar>
            <InputOwnerType />
            <InputOwner
                v-if="
                    values.owner_type &&
                    values.owner_type !== unknownOwnerTypeId &&
                    userStore.hasOwnerPermission
                "
            />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { computed } from "vue";
import { useFormValues } from "vee-validate";
import { useConfigStore } from "@/stores/config.store";
import { useUserStore } from "@/stores/user.store";

import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph } from "@resorptionbidonvilles/ui";
import InputBuiltAt from "../inputs/FormDeclarationDeSiteInputBuiltAt.vue";
import InputDeclaredAt from "../inputs/FormDeclarationDeSiteInputDeclaredAt.vue";
import InputFieldType from "../inputs/FormDeclarationDeSiteInputFieldType.vue";
import InputDetailedAddress from "../inputs/FormDeclarationDeSiteInputDetailedAddress.vue";
import InputOwnerType from "../inputs/FormDeclarationDeSiteInputOwnerType.vue";
import InputOwner from "../inputs/FormDeclarationDeSiteInputOwner.vue";

const values = useFormValues();
const userStore = useUserStore();

const unknownOwnerTypeId = computed(() => {
    const configStore = useConfigStore();
    const type = configStore.config.owner_types.find(
        ({ label }) => label === "Inconnu"
    );
    return type.id;
});
</script>
