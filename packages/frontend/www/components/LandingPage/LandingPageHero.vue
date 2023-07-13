<template>
    <div class="text-center">
        <h1 class="text-display-xl font-bold text-black">{{ $t("landingPage.hero.title") }}</h1>
        <LandingPageContactForm class="mx-auto mb-8" />
        <div class="my-4 text-display-md font-bold">
            <span class="text-white bg-black px-2 py-1">2</span>
            <span class="text-white bg-black px-2 py-1 ml-1">8</span>
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
        <p class="text-lg font-bold">{{ $t("landingPage.hero.moreThan") }} <span class="underline">3 000</span> {{
            $t("landingPage.hero.people") }}</p>
    </div>
</template>

<script setup>
import LandingPageContactForm from "./LandingPageContactForm.vue";
</script>