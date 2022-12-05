<template>
    <Button variant="primaryOutline" :href="`mailto:${CONTACT_EMAIL}`"
        >Contactez-nous</Button
    >
</template>

<script setup>
import ENV from "@/helpers/env.js";
import { Button } from "@resorptionbidonvilles/ui";
const { CONTACT_EMAIL } = ENV;
</script>
