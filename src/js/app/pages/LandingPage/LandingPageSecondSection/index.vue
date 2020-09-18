<template>
    <div>
        <h2>
            <span class="text-size-display-lg font-display font-normal">{{$t('landingPage.secondSection.title')}}</span>
            <span class="text-display-lg block">{{$t('landingPage.secondSection.subtitle')}}</span>
        </h2>
        <div class="mt-8 md:grid md:grid-cols-3 md:gap-16">
            <LandingPageDataBlock
                    :line1="$t('landingPage.secondSection.data.1.line1')"
                    :line2="$t('landingPage.secondSection.data.1.line2')"
                    :line3="$t('landingPage.secondSection.data.1.line3')" />
            <LandingPageDataBlock
                    class="my-4 md:my-0"
                    :line1="$t('landingPage.secondSection.data.2.line1')"
                    :line2="$t('landingPage.secondSection.data.2.line2')"
                    :line3="$t('landingPage.secondSection.data.2.line3')" />
            <LandingPageDataBlock
                    :line1="$t('landingPage.secondSection.data.3.line1')"
                    :line2="$t('landingPage.secondSection.data.3.line2')"
                    :line3="$t('landingPage.secondSection.data.3.line3')" />

        </div>
        <div class="container-sm mt-16">
            <div>{{$t('landingPage.secondSection.firstParagraph')}}</div>
            <div class="mt-8"><span class="font-bold">{{$t('landingPage.secondSection.secondParagraph.bold')}}</span> {{$t('landingPage.secondSection.secondParagraph.normal')}}</div>
            <div><a class="link" href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles">{{$t('landingPage.secondSection.secondParagraph.link')}}</a></div>

            <img class="mt-20" src="./assets/bidonvilles-france-map.jpg" />
        </div>
        <div class="mt-20 flex flex-row items-center">
            <div class="w-1/2 mr-16 bg-gray-500">

                <LandingPageResponsiveEmbed>
                    <iframe src="https://www.dailymotion.com/embed/video/x7mf87e"
                            allowfullscreen
                            allow="autoplay; fullscreen">
                    </iframe>
                </LandingPageResponsiveEmbed>
            </div>
            <div class="w-1/2 text-display-md text-black">
                {{$t('landingPage.secondSection.video.text')}}
            </div>
        </div>
    </div>
</template>

<script>
    import LandingPageDataBlock from './LandingPageDataBlock';
    import LandingPageResponsiveEmbed from '../LandingPageResponsiveEmbed';

    export default {
        components: {
            LandingPageDataBlock,
            LandingPageResponsiveEmbed
        }
    }
</script>

