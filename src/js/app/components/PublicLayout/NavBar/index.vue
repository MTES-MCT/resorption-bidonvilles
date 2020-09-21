<template>
    <div>
        <div v-if="sticky">
            <NavBarSticky v-if="sticky" :menuDisplayed="menuDisplayed" :toggleMenu="toggleMenu" :closeMenu="closeMenu" />
        </div>

        <div v-else>
            <PublicContainer>
                <header role="navigation" class="py-4 flex flex-row justify-between items-center">
                    <NavBarLogo />

                    <div class="hidden md:block">
                        <router-link to="/connexion">
                            <Button variant="primary">{{$t('landingPage.header.connect')}}</Button>
                        </router-link>
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
    import NavBarMobileButton from './NavBarMobileButton'
    import NavBarMobileMenu from './NavBarMobileMenu'
    import PublicContainer from '../PublicContainer'
    import Button from '../../ui/Button'

    export default {
        components: {
            NavBarLogo,
            NavBarSticky,
            Button,
            NavBarMobileMenu,
            NavBarMobileButton,
            PublicContainer
        },
        data() {
          return {
              scrollTop: 0,
              menuDisplayed: false
          }
        },
        methods: {
          handleScroll() {
              setTimeout(() => {
                  this.scrollTop = window.scrollY
              })
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
               return this.scrollTop > 200
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
