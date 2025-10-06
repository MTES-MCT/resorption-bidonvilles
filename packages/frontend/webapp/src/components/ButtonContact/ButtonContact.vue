<template>
    <DsfrButton secondary @click.prevent="openMail">Contactez-nous</DsfrButton>
</template>

<script setup>
import { computed } from "vue";
import ENV from "@/helpers/env.js";

const { CONTACT_EMAIL } = ENV;
const mailtoHref = computed(() =>
    CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : ""
);

const openMail = () => {
    if (!mailtoHref.value) {
        return;
    }
    window.location.href = mailtoHref.value;
};
</script>
<style scoped>
button {
    border: inherit;
}
</style>
