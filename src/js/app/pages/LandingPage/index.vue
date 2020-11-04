<template>
    <PublicLayout :displayLanguagePicker="true">
        <PublicContainer>
            <div class="pt-4">
                <div class="max-w-screen-lg mx-auto pb-20">
                    <LandingPageHero class="mt-20" />
                    <LandingPageFirstSection />
                </div>
            </div>
        </PublicContainer>

        <LandingPageBanner :cta="$t('landingPage.firstBanner.cta')">
            {{ $t("landingPage.firstBanner.text") }}
        </LandingPageBanner>
        <CreditWrapper credit="© Diego Inglez de Souza">
            <img
                class="h-128 w-full object-cover object-center"
                src="./assets/resorption-bidonvilles-1.jpg"
            />
        </CreditWrapper>

        <PublicContainer>
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageSecondSection />
            </div>
        </PublicContainer>

        <LandingPageBanner :cta="$t('landingPage.secondBanner.cta')">
            {{ $t("landingPage.secondBanner.text") }}
        </LandingPageBanner>
        <CreditWrapper credit="© Ville de Strasbourg">
            <img
                class="h-128 w-full object-cover object-top"
                src="./assets/resorption-bidonvilles-2.jpg"
            />
        </CreditWrapper>
        <PublicContainer>
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageThirdSection />
                <div class="text-center mt-40">
                    <h2 class="text-display-lg text-secondary">
                        {{ $t("landingPage.hero.subtitle") }}
                    </h2>
                    <LandingPageContactForm class="mx-auto" />
                </div>
            </div>
        </PublicContainer>

        <CreditWrapper credit="© Ville de Strasbourg">
            <div class="grid grid-cols-3 w-full gap-0">
                <img
                    class="h-64 w-full object-cover object-top"
                    src="./assets/resorption-bidonvilles-3.jpg"
                />
                <img
                    class="h-64 w-full object-cover object-top"
                    src="./assets/resorption-bidonvilles-4.jpg"
                />
                <img
                    class="h-64 w-full object-cover object-top"
                    src="./assets/resorption-bidonvilles-5.jpg"
                /></div
        ></CreditWrapper>
    </PublicLayout>
</template>

<script>
import PublicLayout from "#app/components/PublicLayout/index.vue";
import PublicContainer from "#app/components/PublicLayout/PublicContainer.vue";
import LandingPageHero from "./LandingPageHero/index.vue";
import LandingPageFirstSection from "./LandingPageFirstSection/index.vue";
import LandingPageSecondSection from "./LandingPageSecondSection/index.vue";
import LandingPageThirdSection from "./LandingPageThirdSection/index.vue";
import LandingPageBanner from "./LandingPageBanner.vue";
import LandingPageContactForm from "./LandingPageContactForm.vue";
import CreditWrapper from "./CreditWrapper.vue";

export default {
    components: {
        CreditWrapper,
        PublicContainer,
        PublicLayout,
        LandingPageHero,
        LandingPageFirstSection,
        LandingPageSecondSection,
        LandingPageThirdSection,
        LandingPageBanner,
        LandingPageContactForm
    }
};
</script>
