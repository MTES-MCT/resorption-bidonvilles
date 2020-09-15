<template>
    <div class="max-w-3xl mx-auto">
        <div class="text-xl">{{$t('landingPage.thirdSection.title')}}</div>
        <div class="max-w-xl mx-auto mt-8">
            <div><span class="font-bold">{{$t('landingPage.thirdSection.firstParagraph.bold')}}</span> {{$t('landingPage.thirdSection.firstParagraph.normal')}}</div>

            <div class="flex flex-row items-center my-20">
                <div class="bg-black h-1 flex-1" />
                <div class="inline-block bg-black text-white text-display-md px-4">2019</div>
                <div class="bg-black h-1 flex-1" />
            </div>

            <div class="grid grid-cols-2 gap-16">
                <LandingPageBilanBlock icon="users" :text="$t('landingPage.thirdSection.bilan.1.text')" :info="$t('landingPage.thirdSection.bilan.1.info')" />
                <LandingPageBilanBlock icon="home" :text="$t('landingPage.thirdSection.bilan.2.text')" :info="$t('landingPage.thirdSection.bilan.2.info')" />
                <LandingPageBilanBlock icon="hand-holding-medical" :text="$t('landingPage.thirdSection.bilan.3.text')" :info="$t('landingPage.thirdSection.bilan.3.info')" />
                <LandingPageBilanBlock icon="map-marker-alt" :text="$t('landingPage.thirdSection.bilan.4.text')" :info="$t('landingPage.thirdSection.bilan.4.info')" />
                <LandingPageBilanBlock icon="book" :text="$t('landingPage.thirdSection.bilan.5.text')" :info="$t('landingPage.thirdSection.bilan.5.info')" />
                <LandingPageBilanBlock icon="file-signature" :text="$t('landingPage.thirdSection.bilan.6.text')" :info="$t('landingPage.thirdSection.bilan.6.info')" />
            </div>
            <div class="text-center mt-8">
                <Button variant="secondary">
                    {{$t('landingPage.thirdSection.cta')}}
                </Button>
            </div>
        </div>
        <div class="mt-20">
            <div class="text-display-md">
                {{$t('landingPage.thirdSection.secondParagraph.title')}}
            </div>
            <div class="max-w-xl mx-auto">
                <div class="mt-4">
                    {{$t('landingPage.thirdSection.secondParagraph.body.text1')}}
                    <a href="https://example.com">{{$t('landingPage.thirdSection.secondParagraph.body.link1')}}</a>,
                    {{$t('landingPage.thirdSection.secondParagraph.body.text2')}}.
                    <span class="font-bold">
                    {{$t('landingPage.thirdSection.secondParagraph.body.text3')}}
                    </span>
                    {{$t('landingPage.thirdSection.secondParagraph.body.text4')}}
                    <a href="https://example.com">{{$t('landingPage.thirdSection.secondParagraph.body.link2')}}</a>
                </div>

                <div class="mt-8">
                    <div>{{$t('landingPage.thirdSection.secondParagraph.items.title')}}</div>

                    <ul class="list-disc ml-8">
                        <li><a href="https://example.com">{{$t('landingPage.thirdSection.secondParagraph.items.1.link')}}</a> {{$t('landingPage.thirdSection.secondParagraph.items.1.text')}}</li>
                        <li>{{$t('landingPage.thirdSection.secondParagraph.items.2.text')}}</li>
                        <li><a href="https://example.com">{{$t('landingPage.thirdSection.secondParagraph.items.3.link')}}</a> {{$t('landingPage.thirdSection.secondParagraph.items.3.text')}}</li>
                    </ul>

                </div>

                <div class="flex flex-row items-center justify-between mt-8">
                    <img class="h-32" src="./assets/logo-gouvernement.jpg" />
                    <img class="h-32" src="./assets/logo-commission-europenne.png" />
                </div>

                <div class="flex flex-row items-center justify-between">
                    <img class="h-24" src="./assets/logo-fabrique-numerique.png" />
                    <img class="h-16" src="./assets/logo_beta-gouv-fr.jpg" />
                    <img class="h-12" src="./assets/logo-entrepreneur-interet-general.png" />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import LandingPageBilanBlock from './LandingPageBilanBlock';
    import Button from '#app/components/ui/Button';

    export default {
        components: {
            LandingPageBilanBlock,
            Button
        }
    }
</script>

