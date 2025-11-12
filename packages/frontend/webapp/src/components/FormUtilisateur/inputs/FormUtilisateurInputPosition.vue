<template>
    <DsfrInputGroup
        id="position"
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isSubmitting || disabled"
        type="text"
        v-model="position"
        required
        :valid-message="
            position?.length > 2 && errors.length === 0 && `${label} valide`
        "
    >
        <template #before-input>
            <span class="font-bold not-italic" aria-hidden="true">{{
                label
            }}</span>
            <span class="fr-hint-text"
                >Exemple : Directeur.trice, Chargé.e de mission... 3 caractères
                minimum</span
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
const { value: position, errors } = useField("position", "required");
</script>
