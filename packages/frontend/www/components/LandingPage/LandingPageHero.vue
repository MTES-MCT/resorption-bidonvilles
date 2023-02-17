<template>
    <div class="text-center">
        <h1 class="text-display-xl font-bold text-black">{{ $t("landingPage.hero.title") }}</h1>
        <h2 class="text-secondary text-display-lg font-bold mt-2">
            {{ $t("landingPage.hero.subtitle") }}
        </h2>
        <LandingPageContact class="mx-auto" />
        <div class="my-4 text-display-md font-bold">
            <span class="text-white bg-black px-2 py-1">3</span>
            <span class="text-white bg-black px-2 py-1 ml-1">4</span>
            {{ $t("landingPage.hero.review") }} 2021
        </div>
        <div class="my-4 text-display-md font-bold">
            <span class="text-white bg-black px-2 py-1">1</span>
            <span class="text-white bg-black px-2 py-1 ml-1">6</span>
            {{ $t("landingPage.hero.review") }} 2020
        </div>
        <div class="my-4 text-display-md font-bold">
            <span class="text-white bg-black px-2 py-1">1</span>
            <span class="text-white bg-black px-2 py-1 ml-1">8</span>
            {{ $t("landingPage.hero.review") }} 2019
        </div>
        <p class="text-lg font-bold">Au total plus de <span class="underline">3 000</span> personnes relogées</p>
    </div>
</template>

<script setup>
import LandingPageContact from "./LandingPageContact.vue";
</script>