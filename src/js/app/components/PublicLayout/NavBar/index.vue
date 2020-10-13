<template>
  <div>
    <div :class="!sticky && 'hidden'">
      <NavBarSticky
        :menu-displayed="menuDisplayed"
        :toggle-menu="toggleMenu"
        :close-menu="closeMenu"
      />
    </div>

    <div :class="sticky && 'hidden'">
      <PublicContainer>
        <header
          role="navigation"
          class="py-4 flex flex-row justify-between items-center"
        >
          <NavBarLogo />

          <div class="hidden md:block">
            <router-link to="/connexion">
              <Button variant="primary">
                {{ $t('landingPage.header.connect') }}
              </Button>
            </router-link>
          </div>

          <NavBarMobileButton
            class="md:hidden"
            :on-click="toggleMenu"
          />
        </header>

        <NavBarMobileMenu
          v-if="menuDisplayed"
          :close-menu="closeMenu"
        />
      </PublicContainer>
    </div>
  </div>
</template>

<script>
import NavBarLogo from './NavBarLogo.vue';
import NavBarSticky from './NavBarSticky.vue';
import NavBarMobileButton from './NavBarMobileButton.vue';
import NavBarMobileMenu from './NavBarMobileMenu.vue';
import PublicContainer from '../PublicContainer.vue';
import Button from '../../ui/primitives/Button.vue';

export default {
    components: {
        NavBarLogo,
        NavBarSticky,
        Button,
        NavBarMobileMenu,
        NavBarMobileButton,
        PublicContainer,
    },
    props: {
        stickyHeader: {
            type: Boolean,
        },
    },
    data() {
        return {
            scrollTop: 0,
            menuDisplayed: false,
        };
    },
    computed: {
        sticky() {
            return this.scrollTop > 200 && this.stickyHeader;
        },
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            // Header is 76px but 0px when sticky
            const navbarHeight = this.$el.offsetHeight;

            this.scrollTop = window.scrollY - navbarHeight;
        },
        openMenu() {
            this.menuDisplayed = true;
        },
        closeMenu() {
            this.menuDisplayed = false;
        },

        toggleMenu() {
            this.menuDisplayed = !this.menuDisplayed;
        },
    },
};
</script>
