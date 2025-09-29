<template>
    <DsfrInputGroup
        v-model="closing_context"
        isTextarea
        id="closing_context"
        name="closing_context"
        labelVisible
        label="Préciser le contexte de la fermeture et les faits à signaler"
        labelClass="font-bold"
        hint="Exemples : incendie, violences, départ spontané des habitants..."
        :rows="5"
        :errorMessage="errors.length > 0 ? errors[0] : ''"
    />
</template>

<script setup>
import { useField } from "vee-validate";

const { value: closing_context, errors } = useField(
    "closing_context",
    "required"
);
</script>
