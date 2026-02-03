<template>
    <DsfrInputGroup
        id="access_request_message"
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isSubmitting || disabled"
        type="text"
        v-model="accessRequestMessage"
        required
        isTextarea
        rows="8"
        @blur="handleBlur"
        :valid-message="
            accessRequestMessage?.length > 9 &&
            errors.length === 0 &&
            `Le champ '${label}' est valide`
        "
    >
        <template #before-input>
            <span class="font-bold not-italic" aria-hidden="true">{{
                label
            }}</span>
            <span class="fr-hint-text"
                >Pour rappel, cette plateforme n'est accessible qu'aux acteurs
                de la résorption des bidonvilles</span
            >
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
    value: accessRequestMessage,
    errors,
    handleBlur,
} = useField("access_request_message", "required");
</script>
