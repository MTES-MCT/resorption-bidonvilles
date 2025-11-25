<template>
    <div>
        <LandingPageFAQ v-if="$i18n.locale === 'fr'" />
        <!-- <LandingPageNewsletter :class="$i18n.locale === 'fr' ? 'mt-20' : ''" /> -->
        <div class="text-center mt-20">
            <p v-if="$i18n.locale === 'fr'" class="text-display-lg font-bold text-secondary">
                {{ $t("landingPage.hero.subtitle") }}
            </p>
            <LandingPageContactForm class="mx-auto" />
        </div>
    </div>
</template>

<script setup>
import LandingPageFAQ from "./LandingPageFAQ.vue";
// import LandingPageNewsletter from "./LandingPageNewsletter.vue";
import LandingPageContactForm from "../LandingPageContactForm.vue";

const i18n = useI18n();
</script>