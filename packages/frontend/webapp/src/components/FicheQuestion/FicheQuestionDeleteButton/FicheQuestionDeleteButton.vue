<template>
    <Button
        icon="trash"
        iconPosition="left"
        type="button"
        variant="primary"
        @click="emit('showModale')"
        class="flex-shrink-0"
        >Supprimer la question</Button
    >
</template>

<script setup>
import { Button } from "@resorptionbidonvilles/ui";
const emit = defineEmits(["showModale"]);
</script>
