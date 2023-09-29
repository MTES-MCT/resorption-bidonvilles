<template>
    <div class="mt-8 lg:flex lg:space-x-4">
        <div class="flex-1">
            <video :aria-label="`Témoignage utilisateur:  ${$t('landingPage.firstSection.feedback.1.author')},`"
                class="inline-block" preload="none" controls
                poster="~/assets/img/LandingPage/FirstSection/poster_temoignage_leduc.jpg">
                <source src="~/assets/video/Temoignage-Leduc-BD_mars2021.mp4" type="video/mp4" :aria-label="``" />
                Votre navigateur ne supporte pas la balise video.
            </video>
            <button @click="toggleTranscription(1)" class="mt-2 text-primary hover:underline cursor-pointer"
                :aria-label="`${showTranscription[1] ? $t('landingPage.notranscription_title') : $t('landingPage.transcription_title')},`">
                <span v-if="!showTranscription[1]">{{ $t("landingPage.transcription_title") }}</span>
                <span v-if="showTranscription[1]">{{ $t("landingPage.notranscription_title") }}</span>
            </button>
            <div v-if="showTranscription[1]" tabindex="0" class="m-4 text-left">
                <p class="font-bold mb-2">Témoignage utilisateur - {{ $t("landingPage.firstSection.feedback.1.author") }}
                </p>
                <p>{{ $t("landingPage.firstSection.feedback.videos.1.transcription_part1") }}</p>
                <p>{{ $t("landingPage.firstSection.feedback.videos.1.transcription_part2") }}</p>
                <p>{{ $t("landingPage.firstSection.feedback.videos.1.transcription_part3") }}</p>
            </div>

        </div>
        <div class="flex-1 mt-8 lg:mt-0">
            <video :aria-label="`Témoignage utilisateur:  ${$t('landingPage.firstSection.feedback.2.author')},`"
                class="inline-block" preload="none" controls
                poster="~/assets/img/LandingPage/FirstSection/poster_temoignage_leminor.jpg">
                <source src="~/assets/video/Temoignage-LeMinor-BD_mars2021.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la balise video.
            </video>
            <button @click="toggleTranscription(2)" class="mt-2 text-primary hover:underline cursor-pointer"
                :aria-label="`${showTranscription[2] ? $t('landingPage.notranscription_title') : $t('landingPage.transcription_title')},`">
                <span v-if="!showTranscription[2]">{{ $t("landingPage.transcription_title") }}</span>
                <span v-if="showTranscription[2]">{{ $t("landingPage.notranscription_title") }}</span>
            </button>
            <div v-if="showTranscription[2]" tabindex="0" class="m-4 text-left">
                <p class="font-bold mb-2">Témoignage utilisateur - {{ $t("landingPage.firstSection.feedback.2.author") }}
                </p>
                <p>{{ $t("landingPage.firstSection.feedback.videos.2.transcription_part1") }}</p>
                <p>{{ $t("landingPage.firstSection.feedback.videos.2.transcription_part2") }}</p>
                <p>{{ $t("landingPage.firstSection.feedback.videos.2.transcription_part3") }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const showTranscription = ref({
    1: false,
    2: false,
});
function toggleTranscription(index) {
    showTranscription.value[index] = !showTranscription.value[index];
}
</script>
