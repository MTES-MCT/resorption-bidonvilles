<template>
    <div>
        <div :class="!sticky && 'hidden'">
            <NavBarSticky :menuDisplayed="menuDisplayed" :toggleMenu="toggleMenu" :closeMenu="closeMenu" />
        </div>

        <div :class="sticky && 'hidden'">
            <PublicContainer>
                <header role="navigation" class="py-4 flex flex-row justify-between items-center">
                    <NavBarLogo />

                    <div class="hidden md:flex flex-row">
                        <div>
                            <router-link to="/connexion">
                                <Button variant="primary">{{$t('landingPage.header.connect')}}</Button>
                            </router-link>
                        </div>
                        <LanguagePicker v-if="displayLanguagePicker" class="ml-2" />
                    </div>

                    <NavBarMobileButton class="md:hidden" :onClick="toggleMenu" />
                </header>

                <NavBarMobileMenu v-if="menuDisplayed" :closeMenu="closeMenu" />
            </PublicContainer>
        </div>
    </div>
</template>

<script>
    import NavBarLogo from './NavBarLogo'
    import NavBarSticky from './NavBarSticky'
    import LanguagePicker from './LanguagePicker'
    import NavBarMobileButton from './NavBarMobileButton'
    import NavBarMobileMenu from './NavBarMobileMenu'
    import PublicContainer from '../PublicContainer'
    import Button from '../../ui/primitives/Button'

    export default {
        props: {
          stickyHeader: {
              type: Boolean
          },
          displayLanguagePicker: {
                type: Boolean,
                default: false
          }
        },
        components: {
            NavBarLogo,
            NavBarSticky,
            Button,
            NavBarMobileMenu,
            NavBarMobileButton,
            PublicContainer,
            LanguagePicker
        },
        data() {
          return {
              scrollTop: 0,
              menuDisplayed: false
          }
        },
        methods: {

          handleScroll() {
              // Header is 76px but 0px when sticky
              const navbarHeight = this.$el.offsetHeight

              this.scrollTop = window.scrollY - navbarHeight
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
               return this.scrollTop > 200 && this.stickyHeader
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
