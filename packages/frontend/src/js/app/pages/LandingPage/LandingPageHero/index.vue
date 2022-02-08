<template>
    <div class="text-center">
        <h1 class="text-display-xl font">{{ $t("landingPage.hero.title") }}</h1>
        <h2 class="text-display-lg text-secondary mt-2">
            {{ $t("landingPage.hero.subtitle") }}
        </h2>
        <LandingPageContactForm class="mx-auto" />
        <div class="my-4 text-display-md">
            <span class="text-white bg-black px-2 py-1">1</span>
            <span class="text-white bg-black px-2 py-1 ml-1">6</span>
            {{ $t("landingPage.hero.review") }}
        </div>
    </div>
</template>

<script>
import LandingPageContactForm from "../LandingPageContactForm.vue";

export default {
    components: {
        LandingPageContactForm
    }
};
</script>
