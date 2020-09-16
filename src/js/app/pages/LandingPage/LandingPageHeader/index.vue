<template>
    <header role="navigation" class="flex flex-row justify-between items-center">
        <LandingPageLogo />

        <div class="hidden md:block">
            <router-link to="/connexion">
                <Button variant="primary">{{$t('landingPage.header.connect')}}</Button>
            </router-link>
        </div>
    </header>
</template>

<script>
    import LandingPageLogo from './LandingPageLogo'
    import Button from '../../../components/ui/Button'

    export default {
        components: {
            LandingPageLogo,
            Button
        }
    }
</script>
