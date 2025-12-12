<template>
    <DsfrInputGroup
        id="phone"
        :errorMessage="errors[0]"
        :disabled="isSubmitting || disabled"
        type="tel"
        v-model="phone"
        required
        @blur="handleBlur"
        :valid-message="
            phone?.length > 0 && errors.length === 0 && `${label} valide`
        "
    >
        <template #before-input>
            <span class="font-bold not-italic" aria-hidden="true">{{
                label
            }}</span>
            <span class="fr-hint-text"
                >Format attendu : (+33) 1 22 33 44 55</span
            >
        </template>
    </DsfrInputGroup>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useField, useIsSubmitting } from "vee-validate";

const props = defineProps({
    label: String,
    disabled: Boolean,
});
const { label, disabled } = toRefs(props);

const isSubmitting = useIsSubmitting();
const {
    value: phone,
    errors,
    handleBlur,
} = useField("phone", "required|regex:^[0-9 ]+$");
</script>
