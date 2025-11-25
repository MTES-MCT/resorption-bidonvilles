<template>
    <DsfrInputGroup
        id="referral_word_of_mouth"
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isSubmitting || disabled"
        type="text"
        v-model="referralWordOfMouth"
        required
        @blur="handleBlur"
        :valid-message="
            referralWordOfMouth?.length > 0 &&
            errors.length === 0 &&
            `Le champ '${label}' est valide`
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
    value: referralWordOfMouth,
    errors,
    handleBlur,
} = useField("referral_word_of_mouth", "required");
</script>
