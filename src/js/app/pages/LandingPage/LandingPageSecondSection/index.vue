<template>
    <div>
        <div class="text-xl">
            <div>{{$t('landingPage.secondSection.title')}}</div>
            <div>{{$t('landingPage.secondSection.subtitle')}}</div>
        </div>
        <div class="mt-20 grid grid-cols-3 gap-40">
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
            <div class="mt-20">{{$t('landingPage.secondSection.secondParagraph.bold')}} {{$t('landingPage.secondSection.secondParagraph.normal')}}</div>
            <div>{{$t('landingPage.secondSection.secondParagraph.link')}}</div>

            <img class="mt-20" src="./assets/bidonvilles-france-map.jpg" />

            <div class="mt-20 flex flex-row">
                <div class="w-1/2 bg-gray-500">video</div>
                <div class="w-1/2 text-xl">Comprendre la résorption des bidonvilles en 2 minutes</div>
            </div>
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

