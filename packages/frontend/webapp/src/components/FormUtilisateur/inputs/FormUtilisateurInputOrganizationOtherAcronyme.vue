<template>
    <DsfrInputGroup
        id="organization_other_acronyme"
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isSubmitting || disabled"
        type="text"
        v-model="organizationOtherAcronyme"
        required
        @blur="handleBlur"
        :valid-message="
            organizationOtherAcronyme?.length > 0 &&
            errors.length === 0 &&
            `Acronyme de la structure valide`
        "
    >
        <template #before-input>
            <span class="font-bold not-italic" aria-hidden="true">{{
                label
            }}</span>
        </template>
    </DsfrInputGroup>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useField, useIsSubmitting } from "vee-validate";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
const isSubmitting = useIsSubmitting();
const {
    value: organizationOtherAcronyme,
    errors,
    handleBlur,
} = useField("organization_other_acronyme", "required");
</script>
