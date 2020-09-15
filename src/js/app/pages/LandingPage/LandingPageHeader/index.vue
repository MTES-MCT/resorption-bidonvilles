<template>
    <header role="navigation" class="flex flex-row justify-between items-center">
        <LandingPageLogo />

        <div>
            <Button variant="primary">{{$t('landingPage.header.connect')}}</Button>
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
