<template>
    <div id="plateforme">
        <img width="1024" height="322" class="full-width mx-auto"
            src="~/assets/img/LandingPage/FirstSection/resorption-bidonvilles-dessin.jpg" alt="" />
        <div class="pt-24">
            <div class="max-w-screen-sm mx-auto">
                <h2 class="text-display-lg">
                    {{ $t("landingPage.firstSection.context.title_part1") }}
                    <span class="italic">{{
                        $t("landingPage.firstSection.context.title_part2")
                    }}</span>
                    : {{ $t("landingPage.firstSection.context.title_part3") }}
                </h2>
                <div class="mt-4">
                    <p>{{ $t("landingPage.firstSection.context.text_1") }}</p>
                    <p>{{ $t("landingPage.firstSection.context.text_2") }}</p>
                </div>
            </div>
        </div>
        <div class="mt-20 md:flex md:flex-row items-center">
            <p class="block md:hidden mb-4 text-display-lg font-bold">
                {{ $t("landingPage.firstSection.video.text") }}
            </p>
            <div class="md:w-1/2 md:mr-16">
                <video :aria-label="`${$t('landingPage.firstSection.video.text')},`" preload="none"
                    poster="~/assets/img/LandingPage/FirstSection/poster_video_landing.png" controls>
                    <source src="~/assets/video/video_landing_720_no_sound.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la balise video.
                </video>
                <button @click="toggleTranscription(1)" class="mt-2 text-primary hover:underline cursor-pointer"
                    :aria-label="showTranscription[1] ? $t('landingPage.notranscription_title') + ', ' + $t('landingPage.firstSection.video.text') : $t('landingPage.transcription_title') + ', ' + $t('landingPage.firstSection.video.text') + ','">
                    <span v-if="!showTranscription[1]">{{ $t("landingPage.transcription_title") }}</span>
                    <span v-if="showTranscription[1]">{{ $t("landingPage.notranscription_title") }}</span>
                </button>
            </div>
            <p class="hidden md:block w-1/2 text-display-lg font-bold">
                {{ $t("landingPage.firstSection.video.text") }}
            </p>
        </div>
        <ul v-if="showTranscription[1]" class="mt-4">
            <li>{{ $t("landingPage.firstSection.video.transcription_part1") }}</li>
            <li>{{ $t("landingPage.firstSection.video.transcription_part2") }}</li>
            <li>{{ $t("landingPage.firstSection.video.transcription_part3") }}</li>
            <li>{{ $t("landingPage.firstSection.video.transcription_part4") }}</li>
        </ul>


        <div>
            <div class="md:grid md:grid-cols-3 gap-16 mt-16">
                <LandingPageFeatureBlock icon="map-marked-alt">{{
                    $t("landingPage.firstSection.features.position")
                }}</LandingPageFeatureBlock>
                <LandingPageFeatureBlock class="my-8 md:my-0" icon="chart-line">{{
                    $t("landingPage.firstSection.features.actions")
                }}</LandingPageFeatureBlock>
                <LandingPageFeatureBlock icon="comments">{{
                    $t("landingPage.firstSection.features.exchange")
                }}</LandingPageFeatureBlock>
            </div>
        </div>
        <div class="pt-24" v-if="$i18n.locale === 'fr'">
            <div class="max-w-screen-lg mx-auto">
                <LandingCTABanner :img="ctaPrendreEnMain" alt="Wébinaire prise en main, durée 45mn,"
                    href="https://www.evalandgo.com/f/72933/4pFjfpH19VHD2AZhU2ccYx">
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

<script setup>
import { ref } from "vue";
import LandingPageFeatureBlock from "./LandingPageFeatureBlock.vue";
import LandingPageContextImage from "./LandingPageContextImage.vue";
import LandingCTABanner from "./LandingCTABanner.vue";
import ctaPrendreEnMain from "~/assets/img/LandingPage/FirstSection/cta_prendre_en_main.jpg";

let showTranscription = ref({
    1: false,
    2: false,
    3: false
});

function toggleTranscription(index) {
    showTranscription.value[index] = !showTranscription.value[index];
}
</script>
