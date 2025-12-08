<template>
    <DsfrComplexAutocomplete
        :disabled="isSubmitting || disabled"
        name="organization"
        :label="label"
        :errors="errors"
        hint="3 caractères minimum"
        placeholder="Nom ou acronyme de votre organisation"
        :fn="autocompleteFn"
        v-model="organization"
        showCategory
        ref="autocompleteInput"
        showMandatoryStar
        @update:modelValue="updateOrganization"
        @blur="handleBlur"
        class="mb-4"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { DsfrComplexAutocomplete } from "@resorptionbidonvilles/ui";
import { autocompleOrganization } from "@/api/organizations.api.js";
import { useField, useIsSubmitting } from "vee-validate";

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    disabled: Boolean,
});
const { label, disabled } = toRefs(props);
const emit = defineEmits(["update:modelValue", "change"]);
const isSubmitting = useIsSubmitting();
const {
    value: organization,
    errors,
    handleBlur,
} = useField("organization", "required");

const updateOrganization = (value) => {
    emit("update:modelValue", value);
    emit("change", value);
};

const autocompleteFn = async (value) => {
    const results = await autocompleOrganization(value);
    const allowedTypeIds = new Set([8, 9, 10, 11, 19, 29, 35, 44, 45]);

    const mappedResults = results.map((org) => {
        const prefix =
            org.name.length < 35 || !org.abbreviation
                ? `${org.name}`
                : `${org.abbreviation}`;
        const showLabel = allowedTypeIds.has(org.organization_type_id);
        const label = showLabel ? `${prefix} - ${org.label}` : prefix;

        return {
            id: org.id,
            label: label,
            name: org.name,
            selectedLabel: label,
            category: org.type_abbreviation || org.type,
            data: {
                id: org.id,
                category: org.category,
            },
        };
    });

    return mappedResults;
};
</script>
