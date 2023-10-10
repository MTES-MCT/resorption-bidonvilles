<template>
    <div class="mt-8 lg:flex lg:space-x-4">
        <div class="flex-1">
            <VideoFeedbackUser :authorLabel="$t('landingPage.firstSection.feedback.1.label')"
                :author="$t('landingPage.firstSection.feedback.1.author')"
                :part1="$t('landingPage.firstSection.feedback.videos.1.transcription_part1')"
                :part2="$t('landingPage.firstSection.feedback.videos.1.transcription_part2')"
                :part3="$t('landingPage.firstSection.feedback.videos.1.transcription_part3')" :poster="posterLink1"
                :source="sourceLink1" :trackLabel="$t('french')" :trackSrc="'/Temoignage-Leduc-BD_mars2021.vtt'" />
        </div>
        <div class="flex-1 mt-8 lg:mt-0">
            <VideoFeedbackUser :authorLabel="$t('landingPage.firstSection.feedback.2.label')"
                :author="$t('landingPage.firstSection.feedback.2.author')"
                :part1="$t('landingPage.firstSection.feedback.videos.2.transcription_part1')"
                :part2="$t('landingPage.firstSection.feedback.videos.2.transcription_part2')"
                :part3="$t('landingPage.firstSection.feedback.videos.2.transcription_part3')" :poster="posterLink2"
                :source="sourceLink2" :trackLabel="$t('french')" :trackSrc="'/Temoignage-LeMinor-BD_mars2021.vtt'" />
        </div>
    </div>
</template>
<script setup>
import VideoFeedbackUser from './LandingPageUserFeedbackVideo.vue';
import posterLink1 from '~/assets/img/LandingPage/FirstSection/poster_temoignage_leduc.jpg';
import sourceLink1 from '~/assets/video/Temoignage-Leduc-BD_mars2021.mp4';
import posterLink2 from '~/assets/img/LandingPage/FirstSection/poster_temoignage_leminor.jpg';
import sourceLink2 from '~/assets/video/Temoignage-LeMinor-BD_mars2021.mp4';
</script>
