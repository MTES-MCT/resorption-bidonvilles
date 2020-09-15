<template>
    <div>
        <img class="heroImage mx-auto" src="./assets/resorption-bidonvilles-dessin.png" />
        <div class="grid grid-cols-3 gap-40 mt-20">
            <LandingPageFeatureBlock icon="map-marked-alt">{{$t('landingPage.firstSection.features.position')}}</LandingPageFeatureBlock>
            <LandingPageFeatureBlock icon="chart-line">{{$t('landingPage.firstSection.features.actions')}}</LandingPageFeatureBlock>
            <LandingPageFeatureBlock icon="comments">{{$t('landingPage.firstSection.features.exchange')}}</LandingPageFeatureBlock>
        </div>
        <div class="mt-40">
            <div>{{$t('landingPage.firstSection.context.title')}}</div>
            <div>{{$t('landingPage.firstSection.context.subtitle')}}</div>
            <div>{{$t('landingPage.firstSection.context.text')}}</div>
        </div>
        <div class="flex flex-row mt-20">
            <LandingPageContextImage label="Avant"><img src="./assets/before.jpg" /></LandingPageContextImage>
            <div class="border-solid border-r-2 border-black m-20" />
            <LandingPageContextImage label="Apres"><img src="./assets/after.jpg" /></LandingPageContextImage>
        </div>
        <div class="mx-auto w-1/2 mt-20">
            <div class="text-xl">{{$t('landingPage.firstSection.feedback.1.text')}}</div>
            <div>{{$t('landingPage.firstSection.feedback.1.author')}}</div>
        </div>
    </div>
</template>

<style scoped>
    .heroImage {
        max-width: 800px;
    }
</style>
<script>
    import LandingPageFeatureBlock from '#app/pages/LandingPage/LandingPageFirstSection/LandingPageFeatureBlock';
    import LandingPageContextImage from '#app/pages/LandingPage/LandingPageFirstSection/LandingPageContextImage';
    export default {
        components: { LandingPageContextImage, LandingPageFeatureBlock }
    };
</script>
