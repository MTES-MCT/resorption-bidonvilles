<template>
    <div class="text-center">
        <h1 class="text-5xl">{{$t('landingPage.hero.title')}}</h1>
        <h2 class="text-2xl text-secondary">{{$t('landingPage.hero.subtitle')}}</h2>
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
