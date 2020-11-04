<template>
    <div>
        <img
            class="full-width mx-auto"
            src="./assets/resorption-bidonvilles-dessin.png"
        />
        <div class="max-w-screen-sm mx-auto mt-8">
            <LandingPageResponsiveEmbed>
                <iframe
                    src="https://www.youtube.com/embed/AAD0QoOzIHM?modestbranding=1&autohide=1&showinfo=0"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </LandingPageResponsiveEmbed>
        </div>
        <div>
            <div class="mt-24">
                <div class="max-w-screen-sm mx-auto">
                    <div class="text-display-lg font-normal">
                        {{ $t("landingPage.firstSection.context.title") }}
                    </div>
                    <div class="text-display-lg">
                        {{ $t("landingPage.firstSection.context.subtitle") }}
                    </div>
                    <div class="mt-4">
                        {{ $t("landingPage.firstSection.context.text") }}
                    </div>
                </div>
            </div>

            <div class="md:grid md:grid-cols-3 gap-16 mt-16">
                <LandingPageFeatureBlock icon="map-marked-alt">{{
                    $t("landingPage.firstSection.features.position")
                }}</LandingPageFeatureBlock>
                <LandingPageFeatureBlock
                    class="my-8 md:my-0"
                    icon="chart-line"
                    >{{
                        $t("landingPage.firstSection.features.actions")
                    }}</LandingPageFeatureBlock
                >
                <LandingPageFeatureBlock icon="comments">{{
                    $t("landingPage.firstSection.features.exchange")
                }}</LandingPageFeatureBlock>
            </div>

            <div class="md:flex md:flex-row mt-16">
                <LandingPageContextImage
                    :label="$t('landingPage.firstSection.before')"
                >
                    <img
                        v-if="$i18n.locale === 'fr'"
                        src="./assets/fr/before.jpg"/>
                    <img
                        v-if="$i18n.locale === 'en'"
                        src="./assets/en/before.jpg"/>
                    <img
                        v-if="$i18n.locale === 'bg'"
                        src="./assets/bg/before.jpg"/>
                    <img
                        v-if="$i18n.locale === 'ro'"
                        src="./assets/ro/before.jpg"
                /></LandingPageContextImage>
                <div
                    class="hidden md:block border-solid border-r-2 border-gray-200 m-20"
                />
                <LandingPageContextImage
                    :label="$t('landingPage.firstSection.after')"
                >
                    <img
                        v-if="$i18n.locale === 'fr'"
                        src="./assets/fr/after.jpg"/><img
                        v-if="$i18n.locale === 'en'"
                        src="./assets/en/after.jpg"/>
                    <img
                        v-if="$i18n.locale === 'bg'"
                        src="./assets/bg/after.jpg"/>
                    <img
                        v-if="$i18n.locale === 'ro'"
                        src="./assets/ro/after.jpg"
                /></LandingPageContextImage>
            </div>
            <LandingPageUserFeedback class="mt-32" />
        </div>
    </div>
</template>

<script>
import LandingPageFeatureBlock from "#app/pages/LandingPage/LandingPageFirstSection/LandingPageFeatureBlock.vue";
import LandingPageContextImage from "#app/pages/LandingPage/LandingPageFirstSection/LandingPageContextImage.vue";
import LandingPageUserFeedback from "./LandingPageUserFeedback/index.vue";
import LandingPageResponsiveEmbed from "../LandingPageResponsiveEmbed.vue";

export default {
    components: {
        LandingPageContextImage,
        LandingPageFeatureBlock,
        LandingPageUserFeedback,
        LandingPageResponsiveEmbed
    }
};
</script>
