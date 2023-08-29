<template>
    <LandingPage />
</template>

<script setup>
import LandingPage from "~/components/LandingPage/LandingPage.vue";

useHead({
    title: "Accueil - Résorption-bidonvilles"
});

definePageMeta({
    layout: "home"
});
</script>