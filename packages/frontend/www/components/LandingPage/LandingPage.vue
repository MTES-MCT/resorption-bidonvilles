<template>
    <section id="main-content">
        <!-- first section -->
        <Container class="pt-4">
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageHero />
                <LandingPageFirstSection />
            </div>
        </Container>
        <LandingPageBanner v-if="i18n.locale.value === 'fr'" :cta="$t('landingPage.firstBanner.cta')">
            {{ $t("landingPage.firstBanner.text") }}
        </LandingPageBanner>
        <LandingPageBanner v-else :cta="$t('landingPage.firstBanner.ctaContact')">
            {{ $t("landingPage.firstBanner.text") }}
        </LandingPageBanner>

        <CreditWrapper credit="© Diego Inglez de Souza">
            <img width="1440" class="h-128 w-full object-cover object-center"
                src="~/assets/img/LandingPage/resorption-bidonvilles-1.jpg" alt="" />
        </CreditWrapper>

        <!-- second section -->
        <Container id="strategie">
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageSecondSection />
            </div>
        </Container>
        <LandingPageBanner :cta="$t('landingPage.secondBanner.cta')" :isDemandeAcces="false">
            {{ $t("landingPage.secondBanner.text") }}
        </LandingPageBanner>
        <CreditWrapper credit="© Ville de Strasbourg">
            <img width="1440" class="h-128 w-full object-cover object-top"
                src="~/assets/img/LandingPage/resorption-bidonvilles-2.jpg" alt="" />
        </CreditWrapper>

        <!-- third section -->
        <Container id="faq">
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageThirdSection />
            </div>
        </Container>

        <CreditWrapper credit="© Ville de Strasbourg">
            <div class="grid grid-cols-3 w-full gap-0">
                <img width="600" class="h-64 w-full object-cover object-top"
                    src="~/assets/img/LandingPage/resorption-bidonvilles-3.jpg" alt="" />
                <img width="600" class="h-64 w-full object-cover object-top"
                    src="~/assets/img/LandingPage/resorption-bidonvilles-4.jpg" alt="" />
                <img width="600" class="h-64 w-full object-cover object-top"
                    src="~/assets/img/LandingPage/resorption-bidonvilles-5.jpg" alt="" />
            </div>
        </CreditWrapper>

        <!-- fourth section -->
        <Container id="equipe">
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageFourthSection />
            </div>
        </Container>
    </section>
</template>

<script setup>
import Container from "~/components/Layout/Container/Container.vue";
import LandingPageHero from "./LandingPageHero.vue";
import LandingPageFirstSection from "./FirstSection/LandingPageFirstSection.vue";
import LandingPageSecondSection from "./SecondSection/LandingPageSecondSection.vue";
import LandingPageThirdSection from "./ThirdSection/LandingPageThirdSection.vue";
import LandingPageFourthSection from "./FourthSection/LandingPageFourthSection.vue";
import CreditWrapper from "./CreditWrapper.vue";
import LandingPageBanner from "./LandingPageBanner.vue";
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
</script>