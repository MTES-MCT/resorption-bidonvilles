<template>
    <TextArea
        id="closing_context"
        name="closing_context"
        label="Préciser le contexte de la fermeture et les faits à signaler"
        info="Exemples : incendie, violences, départ spontané des habitants..."
        :rows="5"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
</script>
