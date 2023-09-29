<template>
    <div class="mt-8 lg:flex lg:space-x-4">
        <div class="flex-1">
            <VideoFeedbackUser
                :author="$t('landingPage.firstSection.feedback.1.author')"
                :part1="$t('landingPage.firstSection.feedback.videos.1.transcription_part1')"
                :part2="$t('landingPage.firstSection.feedback.videos.1.transcription_part2')"
                :part3="$t('landingPage.firstSection.feedback.videos.1.transcription_part3')"
                :poster="posterLink1"
                :source="sourceLink1"
                :trackLabel="$t('french')"
                :trackSrc="sttLink1" />
        </div>
        <div class="flex-1 mt-8 lg:mt-0">
            <VideoFeedbackUser
                :author="$t('landingPage.firstSection.feedback.2.author')"
                :part1="$t('landingPage.firstSection.feedback.videos.2.transcription_part1')"
                :part2="$t('landingPage.firstSection.feedback.videos.2.transcription_part2')"
                :part3="$t('landingPage.firstSection.feedback.videos.2.transcription_part3')"
                :poster="posterLink2"
                :source="sourceLink2"
                :trackLabel="$t('french')"
                :trackSrc="sttLink2" />
        </div>
    </div>
</template>
<script setup>
import VideoFeedbackUser from './LandingPageUserFeedbackVideo.vue';
import sttLink1 from '/Temoignage-Leduc-BD_mars2021.vtt';
import sttLink2 from '/Temoignage-LeMinor-BD_mars2021.vtt';

const posterLink1 = new URL('~/assets/img/LandingPage/FirstSection/poster_temoignage_leduc.jpg', import.meta.url);
const sourceLink1 = new URL('~/assets/video/Temoignage-Leduc-BD_mars2021.mp4', import.meta.url);
const posterLink2 = new URL('~/assets/img/LandingPage/FirstSection/poster_temoignage_leminor.jpg', import.meta.url);
const sourceLink2 = new URL('~/assets/video/Temoignage-LeMinor-BD_mars2021.mp4', import.meta.url);
</script>
