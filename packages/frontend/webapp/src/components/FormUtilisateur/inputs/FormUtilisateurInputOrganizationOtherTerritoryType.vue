<template>
    <p class="font-bold">{{ label }}</p>
    <DsfrSelect
        id="organization_other_territory_type"
        :errorMessage="errors.length > 0 ? errors : ''"
        :success-message="
            organizationOtherTerritoryType?.length > 0 &&
            errors.length === 0 &&
            `Territoire de la structure valide`
        "
        defaultUnselectedText="Sélectionner un type de territoire"
        :disabled="isSubmitting || disabled"
        v-model="organizationOtherTerritoryType"
        :options="territories"
        @blur="handleBlur"
    />
</template>

<script setup>
import { ref, toRefs } from "vue";
import { useField, useIsSubmitting } from "vee-validate";

const props = defineProps({
    label: String,
    disabled: Boolean,
});
const { label, disabled } = toRefs(props);
const isSubmitting = useIsSubmitting();
const {
    value: organizationOtherTerritoryType,
    errors,
    handleBlur,
} = useField("organization_other_territory_type", "required");

const territories = ref(["National", "Régional", "Départemental"]);
</script>
