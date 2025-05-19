<template>
    <Button
        variant="primaryOutline"
        class="!border-2 !border-primary hover:!bg-primaryDark"
        :href="`mailto:${CONTACT_EMAIL}`"
        >Contactez-nous</Button
    >
</template>

<script setup>
import ENV from "@/helpers/env.js";
import { Button } from "@resorptionbidonvilles/ui";
const { CONTACT_EMAIL } = ENV;
</script>
<style scoped>
button {
    border: inherit;
}
</style>
