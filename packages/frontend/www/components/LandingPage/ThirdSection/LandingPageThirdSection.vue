<template>
    <div>
        <LandingPageFAQ v-if="$i18n.locale === 'fr'" />
        <LandingPageNewsletter :class="$i18n.locale === 'fr' ? 'mt-20' : ''" />
        <div class="text-center mt-20">
            <h2 class="text-display-lg font-bold text-secondary">
                {{ $t("landingPage.hero.subtitle") }}
            </h2>
            <LandingPageContact class="mx-auto" />
        </div>
    </div>
</template>

<script setup>
import LandingPageFAQ from "./LandingPageFAQ.vue";
import LandingPageNewsletter from "./LandingPageNewsletter.vue";
import LandingPageContact from "../LandingPageContact.vue";
</script>