<template>
    <DsfrInputGroup
        id="email"
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isSubmitting || disabled"
        type="email"
        v-model="email"
        required
        :autocomplete="autocomplete"
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
    value: String,
    showMandatoryStar: Boolean,
    "aria-label": String,
    autocomplete: String,
});

const { label } = toRefs(props);
const isSubmitting = useIsSubmitting();
const {
    value: email,
    errors,
    handleBlur,
} = useField("email", "required|email");
</script>
