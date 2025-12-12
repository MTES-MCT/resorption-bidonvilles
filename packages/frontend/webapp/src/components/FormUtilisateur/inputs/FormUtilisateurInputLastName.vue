<template>
    <DsfrInputGroup
        id="last_name"
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isSubmitting || disabled"
        type="text"
        v-model="lastName"
        required
        @blur="handleBlur"
        :spellcheck="false"
        autocomplete="family-name"
        :valid-message="
            lastName?.length > 1 && errors.length === 0 && `${label} valide`
        "
    >
        <template #before-input>
            <div class="flex items-center gap-1">
                <span class="font-bold not-italic" aria-hidden="true">{{
                    label
                }}</span>
                <span v-if="showMandatoryStar" class="text-red500 font-bold"
                    >*</span
                >
            </div>
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
});
const { label } = toRefs(props);

const isSubmitting = useIsSubmitting();
const {
    value: lastName,
    errors,
    handleBlur,
} = useField("last_name", "required");
</script>
