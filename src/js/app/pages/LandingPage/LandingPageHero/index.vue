<template>
    <div class="text-center">
        <h1 class="text-display-lg text-black">{{$t('landingPage.hero.title')}}</h1>
        <h2 class="text-display-md text-secondary mt-2">{{$t('landingPage.hero.subtitle')}}</h2>
        <LandingPageContactForm class="mx-auto" />
    </div>
</template>

<script>
    import LandingPageContactForm from '../LandingPageContactForm'

    export default {
        components: {
            LandingPageContactForm
        }
    }
</script>
