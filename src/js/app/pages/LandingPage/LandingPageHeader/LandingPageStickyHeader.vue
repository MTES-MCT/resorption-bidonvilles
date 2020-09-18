<template>
    <div class="fixed z-10 top-0 left-0 w-full bg-white shadow">
        <header role="navigation" class="container py-4 flex flex-row justify-between items-center">
            <LandingPageLogo />
            <!-- Desktop actions -->
            <div class="hidden md:block">
                <router-link to="/contact" class="mr-2">
                    <Button variant="secondary">{{$t('landingPage.header.contact')}}</Button>
                </router-link>
                <router-link to="/connexion">
                    <Button variant="primary">{{$t('landingPage.header.connect')}}</Button>
                </router-link>
            </div>

            <LandingPageHeaderMobileButton  class="md:hidden" :onClick="toggleMenu" />

        </header>

        <LandingPageHeaderMobileMenu v-if="menuDisplayed" :closeMenu="closeMenu" />
    </div>
</template>

<script>
    import LandingPageLogo from './LandingPageLogo'
    import LandingPageHeaderMobileMenu from './LandingPageHeaderMobileMenu'
    import LandingPageHeaderMobileButton from './LandingPageHeaderMobileButton'
    import Button from '#app/components/ui/Button'

    export default {
        props: {
          menuDisplayed: {
              type: Boolean,
              required: true
          },
          toggleMenu: {
              type: Function,
              required: true
          },
            closeMenu: {
              type: Function,
              required: true
          },
        },
        components: {
            LandingPageLogo,
            Button,
            LandingPageHeaderMobileMenu,
            LandingPageHeaderMobileButton
        },

    }
</script>
