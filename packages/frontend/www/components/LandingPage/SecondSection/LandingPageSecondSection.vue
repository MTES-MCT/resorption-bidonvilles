<template>
    <div>
        <div class="md:grid md:grid-cols-3 md:gap-16">
            <LandingPageDataBlock :line1="$t('landingPage.secondSection.data.1.line1')"
                :line2="$t('landingPage.secondSection.data.1.line2')"
                :line3="$t('landingPage.secondSection.data.1.line3')" />
            <LandingPageDataBlock class="my-4 md:my-0" :line1="$t('landingPage.secondSection.data.2.line1')"
                :line2="$t('landingPage.secondSection.data.2.line2')"
                :line3="$t('landingPage.secondSection.data.2.line3')" />
            <LandingPageDataBlock :line1="$t('landingPage.secondSection.data.3.line1')"
                :line2="$t('landingPage.secondSection.data.3.line2')"
                :line3="$t('landingPage.secondSection.data.3.line3')" />
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

            <p class="mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.secondParagraph.bold")
                }}</span><br />
                {{ $t("landingPage.secondSection.secondParagraph.normal") }}
            </p>

            <p class="mt-8" v-if="$t('landingPage.secondSection.thirdParagraph')">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.thirdParagraph.bold")
                }}</span><br />
                {{ $t("landingPage.secondSection.thirdParagraph.normal") }}
            </p>
            <img width="640" height="445" class="mt-20 w-full" :src="slumMapImageName"
                :alt="$t('landingPage.secondSection.map.title')" />
            <button @click="toggleMapTranscription()" class="mt-2 text-primary hover:underline cursor-pointer"
                :aria-label="`${showMapTranscription ? $t('landingPage.notranscription_title') : $t('landingPage.transcription_title')},`">
                <span v-if="!showMapTranscription">{{ $t("landingPage.secondSection.map.transcription_title") }}</span>
                <span v-if="showMapTranscription">{{ $t("landingPage.secondSection.map.notranscription_title")
                }}</span>
            </button>
            <div v-if="showMapTranscription" class="mt-4 text-left">
                <p class="font-bold mb-2">{{ $t("landingPage.secondSection.map.title") }}</p>
                <p>{{ $t("landingPage.secondSection.map.subtitle") }}</p>
                <p>{{ $t("landingPage.secondSection.map.nord") }}</p>
                <p>{{ $t("landingPage.secondSection.map.ileDefrance") }}</p>
                <p>{{ $t("landingPage.secondSection.map.loireAtlantique") }}</p>
                <p>{{ $t("landingPage.secondSection.map.gironde") }}</p>
                <p>{{ $t("landingPage.secondSection.map.boucheDuRhone") }}</p>
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
                    Votre navigateur ne supporte pas la balise video.
                </video>
                <button @click="toggleTranscription()" class="mt-2 text-primary hover:underline cursor-pointer"
                    :aria-label="`${showTranscription ? $t('landingPage.notranscription_title') : $t('landingPage.transcription_title')},`">
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
            <div class=" mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.bilan.firstParagraph.bold")
                }}</span>
                {{
                    $t("landingPage.secondSection.bilan.firstParagraph.normal")
                }}
            </div>

            <div class="flex flex-row items-center my-8">
                <div class="bg-gray-500 h-px flex-1" />
                <div class="inline-block bg-black text-white text-display-md font-bold px-4">
                    2020
                </div>
                <div class="bg-gray-500 h-px flex-1" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-16">
                <LandingPageBilanBlock icon="map-marker-alt" :text="$t('landingPage.secondSection.bilan.figures.1.text')" />
                <LandingPageBilanBlock icon="users" :text="$t('landingPage.secondSection.bilan.figures.2.text')" />
                <LandingPageBilanBlock icon="hand-holding-medical"
                    :text="$t('landingPage.secondSection.bilan.figures.3.text')" />
                <LandingPageBilanBlock icon="school" :text="$t('landingPage.secondSection.bilan.figures.4.text')" />
                <LandingPageBilanBlock icon="file-signature" :text="$t('landingPage.secondSection.bilan.figures.6.text')" />
                <LandingPageBilanBlock icon="book" :text="$t('landingPage.secondSection.bilan.figures.5.text')"
                    :info="$t('landingPage.secondSection.bilan.figures.5.info')" />
            </div>
            <div class="text-center mt-8">
                <a target="_blank" v-if="$i18n.locale === 'fr'"
                    href="https://www.gouvernement.fr/sites/default/files/contenu/piece-jointe/2021/10/point_detape_2019-2020_-_resorption_des_bidonvilles_vweb.pdf">
                    <Button variant="primary">
                        {{ $t("landingPage.secondSection.bilan.cta") }}
                    </Button>
                </a>
                <a target="_blank" v-else
                    href="https://www.gouvernement.fr/sites/default/files/contenu/piece-jointe/2022/01/eng_slum_clearance_-_progress_report_2021.pdf">
                    <Button variant="primary">
                        {{ $t("landingPage.secondSection.bilan.cta") }}
                    </Button>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import LandingPageDataBlock from "./LandingPageDataBlock.vue";
import LandingPageBilanBlock from "./LandingPageBilanBlock.vue";
import { Button } from "@resorptionbidonvilles/ui";
import { filename } from 'pathe/utils';

const i18n = useI18n();
const showTranscription = ref(false);
const showMapTranscription = ref(false);

const glob = import.meta.glob('~/assets/img/LandingPage/SecondSection/*.jpg', { eager: true })
const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
)

function toggleTranscription() {
    this.showTranscription = !this.showTranscription;
}

function toggleMapTranscription() {
    this.showMapTranscription = !this.showMapTranscription;
}

const slumMapImageName = computed(() => {
    return images[`map-${i18n.locale.value}`];
});

</script>
