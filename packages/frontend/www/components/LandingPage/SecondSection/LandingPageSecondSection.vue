<template>
    <div>
        <div class="md:grid md:grid-cols-3 md:gap-16">
            <LandingPageDataBlock :line1="$t('landingPage.secondSection.data.1.line1')"
                :line2="$t('landingPage.secondSection.data.1.line2')" />
            <LandingPageDataBlock class="my-4 md:my-0" :line1="$t('landingPage.secondSection.data.2.line1')"
                :line2="$t('landingPage.secondSection.data.2.line2')" />
            <LandingPageDataBlock :line1="$t('landingPage.secondSection.data.3.line1')"
                :line2="$t('landingPage.secondSection.data.3.line2')" />
        </div>

        <div class="max-w-screen-sm mx-auto ">
            <p class="mt-16">
                <span class="text-display-lg font-normal">{{
                    $t("landingPage.secondSection.title")
                }}</span>
            </p>

            <p class="mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.firstParagraph.bold")
                }}</span>
                {{ $t("landingPage.secondSection.firstParagraph.normal") }}
                <br />
                <a class="link"
                    href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles">{{
                        $t("landingPage.secondSection.firstParagraph.link")
                    }}</a>
            </p>

            <img width="640" height="445" class="mt-20 w-full" :src="slumMapImageName"
                :alt="$t('landingPage.secondSection.map.title')" />
            <button @click="toggleMapTranscription()" class="mt-2 text-primary hover:underline cursor-pointer"
                :aria-label="showMapTranscription ? $t('landingPage.secondSection.map.notranscription_title') + ', ' + $t('landingPage.secondSection.map.title') + ',' : $t('landingPage.secondSection.map.transcription_title') + ', ' + $t('landingPage.secondSection.map.title') + ','">
                <span v-if="!showMapTranscription">{{ $t("landingPage.secondSection.map.transcription_title") }}</span>
                <span v-if="showMapTranscription">{{ $t("landingPage.secondSection.map.notranscription_title")
                }}</span>
            </button>
            <div v-if="showMapTranscription" class="mt-4 text-left">
                <p class="font-bold mb-2">{{ $t("landingPage.secondSection.map.title") }}</p>
                <p>{{ $t("landingPage.secondSection.map.subtitle") }}</p>
                <ul>
                    <li>{{ $t("landingPage.secondSection.map.nord") }}</li>
                    <li>{{ $t("landingPage.secondSection.map.ileDeFrance") }}</li>
                    <li>{{ $t("landingPage.secondSection.map.loireAtlantique") }}</li>
                    <li>{{ $t("landingPage.secondSection.map.gironde") }}</li>
                    <li>{{ $t("landingPage.secondSection.map.boucheDuRhone") }}</li>
                </ul>
            </div>
        </div>
        <div class="mt-20 md:flex md:flex-row items-center">
            <p class="block md:hidden mb-4 text-display-lg font-bold">
                {{ $t("landingPage.secondSection.video.text") }}
            </p>
            <div class="md:w-1/2 md:mr-16">
                <video :aria-label="`${$t('landingPage.secondSection.video.text')},`" preload="none"
                    poster="~/assets/img/LandingPage/SecondSection/poster_rb_connaitre_partager_agir.png" controls>
                    <source src="~/assets/video/rb_connaitre_partager_agir_720.mp4" type="video/mp4" />
                    <track :label="$t('french')" kind="subtitles" srclang="fr" src="/rb_connaitre_partager_agir_720.vtt" />
                    Votre navigateur ne supporte pas la balise video.
                </video>
                <button @click="toggleTranscription()" class="mt-2 text-primary hover:underline cursor-pointer"
                    :aria-label="showTranscription ? $t('landingPage.notranscription_title') + ', ' + $t('landingPage.secondSection.video.text') : $t('landingPage.transcription_title') + ', ' + $t('landingPage.secondSection.video.text') + ','">
                    <span v-if="!showTranscription">{{ $t("landingPage.transcription_title") }}</span>
                    <span v-if="showTranscription">{{ $t("landingPage.notranscription_title")
                    }}</span>
                </button>
                <div v-if="showTranscription" class="mt-4 text-left">
                    <p>{{ $t("landingPage.secondSection.video.transcription_part1") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part2") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part3") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part4") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part5") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part6") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part7") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part8") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part9") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part10") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part11") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part12") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part13") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part14") }}</p>
                    <p>{{ $t("landingPage.secondSection.video.transcription_part15") }}</p>
                </div>
            </div>
            <p class="hidden md:block w-1/2 text-display-lg font-bold">
                {{ $t("landingPage.secondSection.video.text") }}
            </p>
        </div>

        <div class="mt-20 max-w-screen-sm mx-auto">
            <p class="text-display-lg font-bold">
                {{ $t("landingPage.secondSection.bilan.title") }}
            </p>
            <p class=" mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.bilan.firstParagraph.bold")
                }}</span>
                {{
                    $t("landingPage.secondSection.bilan.firstParagraph.normal")
                }}
            </p>

            <div class="flex flex-row items-center my-8">
                <p class="bg-gray-500 h-px flex-1" />
                <p class="inline-block bg-black text-white text-display-md font-bold px-4">
                    2022
                </p>
                <p class="bg-gray-500 h-px flex-1" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-16">
                <LandingPageBilanBlock icon="map-marker-alt" :text="$t('landingPage.secondSection.bilan.figures.1.text')" />
                <LandingPageBilanBlock icon="users" :text="$t('landingPage.secondSection.bilan.figures.2.text')" />
                <LandingPageBilanBlock icon="hand-holding-medical"
                    :text="$t('landingPage.secondSection.bilan.figures.3.text')" />
                <LandingPageBilanBlock icon="school" :text="$t('landingPage.secondSection.bilan.figures.4.text')"
                    :info="$t('landingPage.secondSection.bilan.figures.4.info')" />
                <LandingPageBilanBlock icon="file-signature" :text="$t('landingPage.secondSection.bilan.figures.6.text')" />
                <LandingPageBilanBlock icon="book" :text="$t('landingPage.secondSection.bilan.figures.5.text')"
                    :info="$t('landingPage.secondSection.bilan.figures.5.info')" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import LandingPageDataBlock from "./LandingPageDataBlock.vue";
import LandingPageBilanBlock from "./LandingPageBilanBlock.vue";
import { filename } from 'pathe/utils';

const i18n = useI18n();
let showTranscription = ref(false);
let showMapTranscription = ref(false);

const glob = import.meta.glob('~/assets/img/LandingPage/SecondSection/*.jpg', { eager: true })
const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
);

function toggleTranscription() {
    showTranscription.value = !showTranscription.value;
}

function toggleMapTranscription() {
    showMapTranscription.value = !showMapTranscription.value;
}

const slumMapImageName = computed(() => {
    return images[`map-${i18n.locale.value}`];
});

</script>
