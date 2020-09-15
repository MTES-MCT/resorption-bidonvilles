<template>
    <div class="max-w-3xl mx-auto">
        <div>
            <div class="text-xl">{{$t('landingPage.secondSection.title')}}</div>
            <div class="text-xl font-bold">{{$t('landingPage.secondSection.subtitle')}}</div>
        </div>
        <div class="mt-20 grid grid-cols-3 gap-16">
            <LandingPageDataBlock
                    :line1="$t('landingPage.secondSection.data.1.line1')"
                    :line2="$t('landingPage.secondSection.data.1.line2')"
                    :line3="$t('landingPage.secondSection.data.1.line3')" />
            <LandingPageDataBlock
                    :line1="$t('landingPage.secondSection.data.2.line1')"
                    :line2="$t('landingPage.secondSection.data.2.line2')"
                    :line3="$t('landingPage.secondSection.data.2.line3')" />
            <LandingPageDataBlock
                    :line1="$t('landingPage.secondSection.data.3.line1')"
                    :line2="$t('landingPage.secondSection.data.3.line2')"
                    :line3="$t('landingPage.secondSection.data.3.line3')" />

        </div>
        <div class="max-w-xl mt-20 mx-auto">
            <div>{{$t('landingPage.secondSection.firstParagraph')}}</div>
            <div class="mt-8"><span class="font-bold">{{$t('landingPage.secondSection.secondParagraph.bold')}}</span> {{$t('landingPage.secondSection.secondParagraph.normal')}}</div>
            <div><a href="https://www.example.com">{{$t('landingPage.secondSection.secondParagraph.link')}}</a></div>

            <img class="mt-20" src="./assets/bidonvilles-france-map.jpg" />
        </div>
            <div class="mt-20 flex flex-row">
                <div class="w-1/2 mr-16 bg-gray-500">video</div>
                <div class="w-1/2 text-display-md">Comprendre la résorption des bidonvilles en 2 minutes</div>
            </div>




    </div>
</template>

<script>
    import LandingPageDataBlock from './LandingPageDataBlock';

    export default {
        components: {
            LandingPageDataBlock
        }
    }
</script>

