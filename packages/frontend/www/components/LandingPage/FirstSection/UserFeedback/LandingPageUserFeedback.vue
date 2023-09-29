<template>
    <div>
        <div tabindex="0" class="max-w-screen-sm mx-auto relative mt-16" role="region"
            :aria-label="`,${$t('landingPage.firstSection.feedback.title')}`" @focus="setCarouselOff" @blur="setCarouselOn">
            <h2>
                <span class="text-display-lg">{{
                    $t("landingPage.firstSection.feedback.title")
                }}</span>
            </h2>
            <div class="mt-8" @mouseover="setCarouselOff" @mouseleave="setCarouselOn">
                <LandingPageUserFeedbackSection :active="active === 1"
                    :text="$t('landingPage.firstSection.feedback.1.text')"
                    :author="$t('landingPage.firstSection.feedback.1.author')" />
                <LandingPageUserFeedbackSection :active="active === 2"
                    :text="$t('landingPage.firstSection.feedback.2.text')"
                    :author="$t('landingPage.firstSection.feedback.2.author')" />
                <LandingPageUserFeedbackSection :active="active === 3"
                    :text="$t('landingPage.firstSection.feedback.3.text')"
                    :author="$t('landingPage.firstSection.feedback.3.author')" />
            </div>
        </div>
        <div class="mt-2 text-center">
            <LandingPageUserFeedbackBullet :alt="[
                $t('landingPage.firstSection.feedback.1.label'), ' ',
                $t('landingPage.firstSection.feedback.1.author'), ' ',
                $t('landingPage.firstSection.feedback.1.text'), ' ',
            ]" :onClick="() => setSection(1)" :active="active === 1" />
            <LandingPageUserFeedbackBullet :alt="[
                $t('landingPage.firstSection.feedback.2.label'), ' ',
                $t('landingPage.firstSection.feedback.2.author'), ' ',
                $t('landingPage.firstSection.feedback.2.text'), ' ',
            ]" :onClick="() => setSection(2)" :active="active === 2" />
            <LandingPageUserFeedbackBullet :alt="[
                $t('landingPage.firstSection.feedback.3.label'), ' ',
                $t('landingPage.firstSection.feedback.3.author'), ' ',
                $t('landingPage.firstSection.feedback.3.text'), ' ',
            ]" :onClick="() => setSection(3)" :active="active === 3" /><br />
            <button @click="playPauseCarousel()" class="mt-2 text-black cursor-pointer"
                :aria-label="`${carouselOn ? $t('landingPage.firstSection.feedback.carousel_stop') : $t('landingPage.firstSection.feedback.carousel_start')},`"
                tabindex="-1">
                <Icon :icon="`${carouselOn ? 'fa-solid fa-pause' : 'fa-solid fa-play'}`" class="mr-2" />
                <span v-if="!carouselOn">{{ $t("landingPage.firstSection.feedback.carousel_start") }}</span>
                <span v-if="carouselOn">{{ $t("landingPage.firstSection.feedback.carousel_stop")
                }}</span>
            </button>
            <LandingPageUserFeedbackVideos v-if="$i18n.locale === 'fr'" />
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onBeforeUnmount,
} from "vue";
import LandingPageUserFeedbackBullet from "./LandingPageUserFeedbackBullet.vue";
import LandingPageUserFeedbackSection from "./LandingPageUserFeedbackSection.vue";
import LandingPageUserFeedbackVideos from "./LandingPageUserFeedbackVideos.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const i18n = useI18n();
const carouselOn = ref(true);
let active = ref(1);
let interval = ref(null);

function setNextSection() {
    if (active.value === 1) {
        active.value = 2;
    } else if (active.value === 2) {
        active.value = 3;
    } else if (active.value === 3) {
        active.value = 1;
    }
}
function setSection(activeSection) {
    active.value = activeSection;
    // reset delay
    clearInterval(interval.value);
    interval.value = setInterval(setNextSection, 8000);
}

function playPauseCarousel() {
    if (carouselOn.value === true) {
        setCarouselOff();
    } else {
        setCarouselOn();
    }
}
function setCarouselOn() {
    setNextSection();
    interval.value = setInterval(setNextSection, 8000);
    carouselOn.value = true;
}
function setCarouselOff() {
    clearInterval(interval.value);
    carouselOn.value = false;
}
onMounted(() => {
    interval.value = setInterval(setNextSection, 8000);
});

onBeforeUnmount(() => {
    clearInterval(interval.value);
})
</script>
