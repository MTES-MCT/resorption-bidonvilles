<template>
    <div id="plateforme">
        <img
            width="1024"
            height="322"
            class="full-width mx-auto"
            src="~/assets/img/LandingPage/FirstSection/resorption-bidonvilles-dessin.jpg"
            alt="Illustration dessinée d'un bidonville et de ses habitant(e)s"
        />
        <div class="pt-24">
            <div class="max-w-screen-sm mx-auto">
                <div class="text-display-lg">
                    {{ $t("landingPage.firstSection.context.title_part1") }}
                    <span class="italic">{{
                        $t("landingPage.firstSection.context.title_part2")
                    }}</span>
                    : {{ $t("landingPage.firstSection.context.title_part3") }}
                </div>
                <div class="mt-4">
                    <p>{{ $t("landingPage.firstSection.context.text_1") }}</p>
                    <p>{{ $t("landingPage.firstSection.context.text_2") }}</p>
                </div>
            </div>
        </div>
        <div class="mt-20 md:flex md:flex-row items-center">
            <div class="block md:hidden mb-4 text-display-lg font-bold">
                {{ $t("landingPage.firstSection.video.text") }}
            </div>
            <div class="md:w-1/2 md:mr-16 bg-gray-500">
                <video preload="none" poster="~/assets/img/LandingPage/FirstSection/poster_video_landing.png" controls>
                    <source
                        src="~/assets/video/video_landing_720_no_sound.mp4"
                        type="video/mp4"
                    />
                    Votre navigateur ne supporte pas la balise video.
                </video>
            </div>
            <div class="hidden md:block w-1/2 text-display-lg font-bold">
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
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'fr'"
                        src="~/assets/img/LandingPage/FirstSection/fr/before-fr.jpg"
                        alt="Illustration dessinée de l'organisation de la politique de résorption sans la plateforme" />
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'en'"
                        src="~/assets/img/LandingPage/FirstSection/en/before-en.png"
                        alt="Drawn illustration" />
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'bg'"
                        src="~/assets/img/LandingPage/FirstSection/bg/before-bg.png"
                        alt="Drawn illustration" />
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'ro'"
                        src="~/assets/img/LandingPage/FirstSection/ro/before-ro.png"
                        alt="Drawn illustration"
                /></LandingPageContextImage>
                <div
                    class="hidden md:block border-solid border-r-2 border-gray-200 m-20"
                />
                <LandingPageContextImage
                    :label="$t('landingPage.firstSection.after')"
                >
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'fr'"
                        src="~/assets/img/LandingPage/FirstSection/fr/after-fr.jpg"
                        alt="Illustration dessinée de l'organisation de la politique de résorption avec la plateforme" />
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'en'"
                        src="~/assets/img/LandingPage/FirstSection/en/after-en.png"
                        alt="Drawn illustration"/>
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'bg'"
                        src="~/assets/img/LandingPage/FirstSection/bg/after-bg.png"
                        alt="Drawn illustration"/>
                    <img
                        width="430"
                        height="319"
                        v-if="$i18n.locale === 'ro'"
                        src="~/assets/img/LandingPage/FirstSection/ro/after-ro.png"
                        alt="Drawn illustration"
                /></LandingPageContextImage>
            </div>
            <LandingPageUserFeedback class="mt-32" />
        </div>

        <div class="pt-24" v-if="$i18n.locale === 'fr'" >
            <div class="max-w-screen-lg mx-auto">
                <LandingCTABanner :img="ctaDecouvrir" alt="Illustration du wébinaire découverte" href="https://app.evalandgo.com/s/index.php?id=JTk5aSU5M2slOTklQUQ%3D&a=JTk2cCU5N2slOUElQjA%3D">
                    <template v-slot:title>
                        Webinaire découverte <span class="italic">Résorption-bidonvilles</span>
                    </template>
                    <template v-slot:content>
                        Vous souhaitez découvrir la plateforme numérique
                        <span class="italic">Résorption-bidonvilles</span> ?
                        comprendre son rôle dans la politique publique ?<br />
                        Inscrivez-vous ! Nous répondrons à toutes vos questions.
                    </template>
                </LandingCTABanner>

                <LandingCTABanner :img="ctaPrendreEnMain" alt="Illustration du wébinaire prise en main" href="https://app.evalandgo.com/s/index.php?id=JTk5aSU5M2slOTklQUI%3D&a=JTk2cCU5N2slOUElQjA%3D">
                    <template v-slot:title>
                        Webinaire prise en main de
                    <span class="italic">Résorption-bidonvilles</span>
                    </template>
                    <template v-slot:content>
                        Vous souhaitez prendre en main la plateforme ? découvrir les
                        fonctionnalités qui vous seront utiles ? vous remettre à
                        niveau ? Nous vous montrerons l'essentiel avec une
                        démonstration personnalisée et en direct.
                    </template>
                </LandingCTABanner>
            </div>
        </div>
    </div>
</template>

<script>
import LandingPageFeatureBlock from "./LandingPageFeatureBlock.vue";
import LandingPageContextImage from "./LandingPageContextImage.vue";
import LandingPageUserFeedback from "./UserFeedback/LandingPageUserFeedback.vue";
import LandingCTABanner from "./LandingCTABanner.vue";
import ctaDecouvrir from "~/assets/img/LandingPage/FirstSection/cta_decouvrir.jpg";
import ctaPrendreEnMain from "~/assets/img/LandingPage/FirstSection/cta_prendre_en_main.jpg";

export default {
    components: {
        LandingPageContextImage,
        LandingPageFeatureBlock,
        LandingPageUserFeedback,
        LandingCTABanner
    },

    data() {
        return {
            ctaDecouvrir,
            ctaPrendreEnMain
        };
    }
};
</script>
