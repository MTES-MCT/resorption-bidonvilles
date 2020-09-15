<template>
    <div>
        <div class="container mx-auto pt-4 pb-16">
            <LandingPageHeader />
            <LandingPageHero class="mt-20" />
            <LandingPageFirstSection />
        </div>
        <LandingPageBanner  :cta="$t('landingPage.firstBanner.cta')">
            {{$t('landingPage.firstBanner.text')}}
        </LandingPageBanner>
        <img class="h-128 w-full object-cover object-center" src="./assets/resorption-bidonvilles-1.jpg"  />
        <div class="container mx-auto py-16">
            <LandingPageSecondSection />
        </div>
        <LandingPageBanner class="mt-20" :cta="$t('landingPage.secondBanner.cta')">
            {{$t('landingPage.secondBanner.text')}}
        </LandingPageBanner>
        <img class="h-128 w-full object-cover object-top" src="./assets/resorption-bidonvilles-2.jpg" />
        <div class="container mx-auto py-16">
            <LandingPageThirdSection />
            <div class="text-center mt-20">
                <h2 class="text-2xl text-secondary">{{$t('landingPage.hero.subtitle')}}</h2>
                <LandingPageContactForm class="mx-auto" />
            </div>
        </div>
        <div class="grid grid-cols-3 w-full gap-0">
            <img class="h-64 w-full object-cover object-top" src="./assets/resorption-bidonvilles-3.jpg"  />
            <img class="h-64 w-full object-cover object-top" src="./assets/resorption-bidonvilles-4.jpg"  />
            <img class="h-64 w-full object-cover object-top" src="./assets/resorption-bidonvilles-5.jpg"  />
        </div>
        <LandingPageFooter />
    </div>

</template>

<script>
    import LandingPageHeader from './LandingPageHeader'
    import LandingPageHero from './LandingPageHero'
    import LandingPageFirstSection from './LandingPageFirstSection'
    import LandingPageSecondSection from './LandingPageSecondSection'
    import LandingPageThirdSection from './LandingPageThirdSection'
    import LandingPageBanner from './LandingPageBanner'
    import LandingPageContactForm from './LandingPageContactForm'
    import LandingPageFooter from './LandingPageFooter'

    export default {
        components: {
            LandingPageHeader,
            LandingPageHero,
            LandingPageFirstSection,
            LandingPageSecondSection,
            LandingPageThirdSection,
            LandingPageBanner,
            LandingPageContactForm,
            LandingPageFooter
        }
    }
</script>



