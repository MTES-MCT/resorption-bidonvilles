<template>
    <div>
        <g-image
            width="1024"
            class="full-width mx-auto"
            src="./assets/resorption-bidonvilles-dessin.png"
        />
        <LandingEventBanner v-if="$i18n.locale === 'fr'" />
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
        <div class="mt-20 md:flex md:flex-row items-center">
            <div class="block md:hidden mb-4 text-display-lg">
                {{ $t("landingPage.firstSection.video.text") }}
            </div>
            <div class="md:w-1/2 md:mr-16 bg-gray-500">
                <video poster="./assets/poster_video_landing.png" controls>
                    <source
                        src="./assets/video_landing_720_no_sound.mp4"
                        type="video/mp4"
                    />
                    Votre navigateur ne supporte pas la balise video.
                </video>
            </div>
            <div class="hidden md:block w-1/2 text-display-lg">
                {{ $t("landingPage.firstSection.video.text") }}
            </div>
        </div>

        <div>
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
                    <g-image
                        v-if="$i18n.locale === 'fr'"
                        src="./assets/fr/before-fr.jpg"/>
                    <g-image
                        v-if="$i18n.locale === 'en'"
                        src="./assets/en/before-en.png"/>
                    <g-image
                        v-if="$i18n.locale === 'bg'"
                        src="./assets/bg/before-bg.png"/>
                    <g-image
                        v-if="$i18n.locale === 'ro'"
                        src="./assets/ro/before-ro.png"
                /></LandingPageContextImage>
                <div
                    class="hidden md:block border-solid border-r-2 border-gray-200 m-20"
                />
                <LandingPageContextImage
                    :label="$t('landingPage.firstSection.after')"
                >
                    <g-image
                        v-if="$i18n.locale === 'fr'"
                        src="./assets/fr/after-fr.jpg"/>
                    <g-image
                        v-if="$i18n.locale === 'en'"
                        src="./assets/en/after-en.png"/>
                    <g-image
                        v-if="$i18n.locale === 'bg'"
                        src="./assets/bg/after-bg.png"/>
                    <g-image
                        v-if="$i18n.locale === 'ro'"
                        src="./assets/ro/after-ro.png"
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
import LandingEventBanner from "../LandingEventBanner";

export default {
    components: {
        LandingPageContextImage,
        LandingPageFeatureBlock,
        LandingPageUserFeedback,
        LandingEventBanner
    }
};
</script>
