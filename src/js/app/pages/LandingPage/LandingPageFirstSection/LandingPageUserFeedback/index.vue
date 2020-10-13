<template>
  <div>
    <div class="max-w-screen-sm mx-auto relative mt-16">
      <LandingPageUserFeedbackSection
        :active="active === 1"
        :text="$t('landingPage.firstSection.feedback.1.text')"
        :author="$t('landingPage.firstSection.feedback.1.author')"
      />
      <LandingPageUserFeedbackSection
        :active="active === 2"
        :text="$t('landingPage.firstSection.feedback.2.text')"
        :author="$t('landingPage.firstSection.feedback.2.author')"
      />
      <LandingPageUserFeedbackSection
        :active="active === 3"
        :text="$t('landingPage.firstSection.feedback.3.text')"
        :author="$t('landingPage.firstSection.feedback.3.author')"
      />
    </div>
    <div class="mt-2 text-center">
      <LandingPageUserFeedbackBullet
        :on-click="() => setSection(1)"
        :active="active === 1"
      />
      <LandingPageUserFeedbackBullet
        :on-click="() => setSection(2)"
        :active="active === 2"
      />
      <LandingPageUserFeedbackBullet
        :on-click="() => setSection(3)"
        :active="active === 3"
      />
    </div>
  </div>
</template>

<script>
import LandingPageUserFeedbackBullet from './LandingPageUserFeedbackBullet';
import LandingPageUserFeedbackSection from './LandingPageUserFeedbackSection';

export default {
    components: {
        LandingPageUserFeedbackBullet,
        LandingPageUserFeedbackSection,
    },
    data() {
        return {
            active: 1,
            interval: null,
        };
    },
    mounted() {
        this.interval = setInterval(this.setNextSection, 8000);
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    methods: {
        setNextSection() {
            if (this.active === 1) {
                this.active = 2;
            } else if (this.active === 2) {
                this.active = 3;
            } else if (this.active === 3) {
                this.active = 1;
            }
        },
        setSection(activeSection) {
            this.active = activeSection;
            // reset delay
            clearInterval(this.interval);
            this.interval = setInterval(this.setNextSection, 8000);
        },
    },
};
</script>
