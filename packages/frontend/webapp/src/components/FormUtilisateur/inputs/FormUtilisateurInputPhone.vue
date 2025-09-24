<template>
    <DsfrInputGroup
        id="phone"
        :errorMessage="errors[0]"
        :disabled="isSubmitting || disabled"
        type="tel"
        v-model="phone"
        required
        @blur="handleBlur"
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
    value: phone,
    errors,
    handleBlur,
} = useField("phone", "required|regex:^[0-9 ]+$");
</script>
