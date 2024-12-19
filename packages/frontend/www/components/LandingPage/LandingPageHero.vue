<template>
    <div class="text-center">
        <h1 class="text-display-xl font-bold text-black">{{ $t("landingPage.hero.title") }}</h1>
        <p class="text-secondary text-display-lg font-bold mt-2">
            {{ $t("landingPage.hero.subtitle") }}
        </p>
        <LandingPageContactForm class="mx-auto mb-8" />
        <p class="text-lg font-bold mt-2">{{ $t("landingPage.hero.moreThan") }}
            <span class="my-4 text-display-md font-bold">
                <span class="text-white bg-black px-2 py-1">9</span>
                <span class="text-white bg-black px-2 py-1 ml-1">0</span>
            </span>
            {{ $t("landingPage.hero.review") }}
            {{ $t("landingPage.hero.people") }}
            {{ $t("landingPage.hero.since2019") }}
        </p>
    </div>
</template>

<script setup>
import LandingPageContactForm from "./LandingPageContactForm.vue";
</script>