<template>
    <div class="text-center">
        <h1 class="text-display-xl font-bold text-black">{{ $t("landingPage.hero.title") }}</h1>
        <h2 class="text-secondary text-display-lg font-bold mt-2">
            {{ $t("landingPage.hero.subtitle") }}
        </h2>
        <LandingPageContactForm class="mx-auto" />
        <div class="my-4 text-display-md font-bold">
            <span class="text-white bg-black px-2 py-1">1</span>
            <span class="text-white bg-black px-2 py-1 ml-1">6</span>
            {{ $t("landingPage.hero.review") }}
        </div>
    </div>
</template>

<script setup>
import LandingPageContactForm from "./LandingPageContactForm.vue";
</script>