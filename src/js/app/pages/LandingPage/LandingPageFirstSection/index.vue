<template>
    <div>
        <img class="full-width mx-auto" src="./assets/resorption-bidonvilles-dessin.png" />
        <div>
            <div class="md:grid md:grid-cols-3 gap-8 mt-16">
                <LandingPageFeatureBlock icon="map-marked-alt">{{$t('landingPage.firstSection.features.position')}}</LandingPageFeatureBlock>
                <LandingPageFeatureBlock class="my-8 md:my-0" icon="chart-line">{{$t('landingPage.firstSection.features.actions')}}</LandingPageFeatureBlock>
                <LandingPageFeatureBlock icon="comments">{{$t('landingPage.firstSection.features.exchange')}}</LandingPageFeatureBlock>
            </div>
            <div class="mt-24">
                <div class="text-xl text-heading">{{$t('landingPage.firstSection.context.title')}}</div>
                <div class="text-xl font-bold">{{$t('landingPage.firstSection.context.subtitle')}}</div>
                <div class="container-md mt-4">
                    <div>{{$t('landingPage.firstSection.context.text')}}</div>
                </div>

            </div>

            <div class="md:flex md:flex-row mt-16">
                <LandingPageContextImage label="Avant"><img src="./assets/before.jpg" /></LandingPageContextImage>
                <div class="hidden md:block border-solid border-r-2 border-black m-20" />
                <LandingPageContextImage label="Apres"><img src="./assets/after.jpg" /></LandingPageContextImage>
            </div>
            <div class="container-sm mt-16">
                <div class="text-xl">{{$t('landingPage.firstSection.feedback.1.text')}}</div>
                <div class="text-lg font-light">{{$t('landingPage.firstSection.feedback.1.author')}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import LandingPageFeatureBlock from '#app/pages/LandingPage/LandingPageFirstSection/LandingPageFeatureBlock';
    import LandingPageContextImage from '#app/pages/LandingPage/LandingPageFirstSection/LandingPageContextImage';
    export default {
        components: { LandingPageContextImage, LandingPageFeatureBlock }
    };
</script>
