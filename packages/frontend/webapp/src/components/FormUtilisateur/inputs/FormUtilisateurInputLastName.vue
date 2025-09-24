<template>
    <DsfrInputGroup
        id="last_name"
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isSubmitting || disabled"
        type="text"
        v-model="lastName"
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
    value: lastName,
    errors,
    handleBlur,
} = useField("last_name", "required");
</script>
