<template>
    <video :aria-label="`Témoignage utilisateur:  ${author}},`" class="inline-block" preload="none" controls
        :poster="poster">
        <source :src="source" type="video/mp4" :aria-label="''" />
        <track v-if="trackSrc" :label="trackLabel" kind="subtitles" srclang="fr" :src="trackSrc" />
        Votre navigateur ne supporte pas la balise video.
    </video>
    <button @click="toggleTranscription()" class="mt-2 text-primary hover:underline cursor-pointer" :aria-label="showTranscription ?
        $t('landingPage.notranscription_title') + ', ' + authorLabel + ',' :
        $t('landingPage.transcription_title') + ', ' + authorLabel + ','">
        <span v-if="!showTranscription">{{ $t("landingPage.transcription_title") }}</span>
        <span v-if="showTranscription">{{ $t("landingPage.notranscription_title") }}</span>
    </button>
    <div v-if="showTranscription" tabindex="0" class="m-4 text-left">
        <p class="font-bold mb-2">
            Témoignage utilisateur - {{ author }}
        </p>
        <p>{{ part1 }}</p>
        <p>{{ part2 }}</p>
        <p>{{ part3 }}</p>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
    authorLabel: String,
    author: String,
    part1: String,
    part2: String,
    part3: String,
    poster: String,
    source: String,
    trackLabel: String,
    trackSrc: String,
});

const showTranscription = ref(false);

function toggleTranscription() {
    showTranscription.value = !showTranscription.value;
}
</script>
