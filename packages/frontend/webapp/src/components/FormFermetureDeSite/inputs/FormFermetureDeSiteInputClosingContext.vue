<template>
    <DsfrInputGroup
        v-model="closing_context"
        isTextarea
        id="closing_context"
        name="closing_context"
        :rows="5"
        :errorMessage="errors.length > 0 ? errors[0] : ''"
    >
        <template #before-input>
            <p class="font-bold" :class="{ 'text-error': errors.length > 0 }">
                Préciser le contexte de la fermeture et les faits à signaler
            </p>
            <span class="fr-hint-text">
                Exemples : incendie, violences, départ spontané des habitants...
            </span>
        </template>
    </DsfrInputGroup>
</template>

<script setup>
import { useField } from "vee-validate";

const { value: closing_context, errors } = useField(
    "closing_context",
    "required"
);
</script>
<style scoped>
.fr-label {
    font-weight: 600 !important;
}
</style>
