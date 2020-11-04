<template>
    <div>
        <div class="md:grid md:grid-cols-3 md:gap-16">
            <LandingPageDataBlock
                :line1="$t('landingPage.secondSection.data.1.line1')"
                :line2="$t('landingPage.secondSection.data.1.line2')"
                :line3="$t('landingPage.secondSection.data.1.line3')"
            />
            <LandingPageDataBlock
                class="my-4 md:my-0"
                :line1="$t('landingPage.secondSection.data.2.line1')"
                :line2="$t('landingPage.secondSection.data.2.line2')"
                :line3="$t('landingPage.secondSection.data.2.line3')"
            />
            <LandingPageDataBlock
                :line1="$t('landingPage.secondSection.data.3.line1')"
                :line2="$t('landingPage.secondSection.data.3.line2')"
                :line3="$t('landingPage.secondSection.data.3.line3')"
            />
        </div>

        <div class="max-w-screen-sm mx-auto ">
            <h2 class="mt-16">
                <span class="text-display-lg font-normal">{{
                    $t("landingPage.secondSection.title")
                }}</span>
                <span class="text-display-lg block">{{
                    $t("landingPage.secondSection.subtitle")
                }}</span>
            </h2>
            <div class="mt-8">
                {{ $t("landingPage.secondSection.firstParagraph") }}
            </div>
            <div class="mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.secondParagraph.bold")
                }}</span>
                {{ $t("landingPage.secondSection.secondParagraph.normal") }}
            </div>
            <div>
                <a
                    class="link"
                    href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles"
                    >{{
                        $t("landingPage.secondSection.secondParagraph.link")
                    }}</a
                >
            </div>

            <img
                v-if="$i18n.locale === 'fr'"
                class="mt-20 w-full"
                src="./assets/map-fr.jpg"
            />
            <img
                v-if="$i18n.locale === 'en'"
                class="mt-20 w-full"
                src="./assets/map-en.jpg"
            />
            <img
                v-if="$i18n.locale === 'bg'"
                class="mt-20 w-full"
                src="./assets/map-bg.png"
            />
            <img
                v-if="$i18n.locale === 'ro'"
                class="mt-20 w-full"
                src="./assets/map-ro.jpg"
            />
        </div>
        <div class="mt-20 md:flex md:flex-row items-center">
            <div class="block md:hidden mb-4 text-display-lg">
                {{ $t("landingPage.secondSection.video.text") }}
            </div>
            <div class="md:w-1/2 md:mr-16 bg-gray-500">
                <LandingPageResponsiveEmbed>
                    <iframe
                        src="https://www.dailymotion.com/embed/video/x7mf87e"
                        allowfullscreen
                        allow="autoplay; fullscreen"
                    >
                    </iframe>
                </LandingPageResponsiveEmbed>
            </div>
            <div class="hidden md:blockw-1/2 text-display-lg">
                {{ $t("landingPage.secondSection.video.text") }}
            </div>
        </div>
    </div>
</template>

<script>
import LandingPageDataBlock from "./LandingPageDataBlock.vue";
import LandingPageResponsiveEmbed from "../LandingPageResponsiveEmbed.vue";

export default {
    components: {
        LandingPageDataBlock,
        LandingPageResponsiveEmbed
    }
};
</script>
