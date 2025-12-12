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
        :valid-message="
            email?.length > 0 && errors.length === 0 && `${label} valide`
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
            <span v-if="hint" class="fr-hint-text">{{ hint }}</span>
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
    hint: {
        type: String,
        required: false,
        default: "",
    },
});

const { label } = toRefs(props);
const isSubmitting = useIsSubmitting();
const {
    value: email,
    errors,
    handleBlur,
} = useField("email", "required|email");
</script>
