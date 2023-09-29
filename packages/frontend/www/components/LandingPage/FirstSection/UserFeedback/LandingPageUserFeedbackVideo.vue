<template>
    <video :aria-label="`Témoignage utilisateur:  ${author}},`" class="inline-block" preload="none" controls
        :poster="poster">
        <source :src="source" type="video/mp4" />
        Votre navigateur ne supporte pas la balise video.
    </video>
    <button @click="toggleTranscription()" class="mt-2 text-primary hover:underline cursor-pointer"
        :aria-label="`${showTranscription ? $t('landingPage.notranscription_title') : $t('landingPage.transcription_title')},`">
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
    author: String,
    part1: String,
    part2: String,
    part3: String,
    poster: String,
    source: String,
});

const showTranscription = ref(false);

function toggleTranscription() {
    showTranscription.value = !showTranscription.value;
}
</script>
