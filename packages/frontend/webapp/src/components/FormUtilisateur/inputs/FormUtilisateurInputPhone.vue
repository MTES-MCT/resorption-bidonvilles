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
        </template>
    </DsfrInputGroup>
</template>

<script setup>
import { defineProps, toRefs, watch } from "vue";
import { useField, useIsSubmitting } from "vee-validate";

const props = defineProps({
    label: String,
    disabled: Boolean,
});
const { label, disabled } = toRefs(props);

const isSubmitting = useIsSubmitting();
const { value: phone, errors, handleBlur } = useField("phone", "required");

watch(phone, (newValue) => {
    if (newValue) {
        phone.value = newValue.replaceAll(/[^0-9+]/g, "");
    }
});
</script>
