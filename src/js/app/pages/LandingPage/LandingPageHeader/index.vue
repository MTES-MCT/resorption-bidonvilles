<template>
    <div>
        <div v-if="sticky">
            <LandingPageStickyHeader v-if="sticky" :menuDisplayed="menuDisplayed" :toggleMenu="toggleMenu" :closeMenu="closeMenu" />
        </div>

        <div v-else>
            <header role="navigation" class="flex flex-row justify-between items-center">
                <LandingPageLogo />

                <div class="hidden md:block">
                    <router-link to="/connexion">
                        <Button variant="primary">{{$t('landingPage.header.connect')}}</Button>
                    </router-link>
                </div>

                <LandingPageHeaderMobileButton class="md:hidden" :onClick="toggleMenu" />
            </header>
            <LandingPageHeaderMobileMenu v-if="menuDisplayed" :closeMenu="closeMenu" />
        </div>
    </div>
</template>

<script>
    import LandingPageLogo from './LandingPageLogo'
    import LandingPageStickyHeader from './LandingPageStickyHeader'
    import LandingPageHeaderMobileButton from './LandingPageHeaderMobileButton'
    import LandingPageHeaderMobileMenu from './LandingPageHeaderMobileMenu'
    import Button from '../../../components/ui/Button'

    export default {
        components: {
            LandingPageLogo,
            LandingPageStickyHeader,
            Button,
            LandingPageHeaderMobileMenu,
            LandingPageHeaderMobileButton
        },
        data() {
          return {
              scrollTop: 0,
              menuDisplayed: false
          }
        },
        methods: {
          handleScroll() {
              this.scrollTop = window.scrollY
              console.log(this.scrollTop);
             },
          openMenu() {
              this.menuDisplayed = true
          },
          closeMenu() {
              this.menuDisplayed = false
          },

            toggleMenu() {
            this.menuDisplayed = !this.menuDisplayed
            }
        },
        computed: {
           sticky() {
               return this.scrollTop > 150
           }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }
</script>
