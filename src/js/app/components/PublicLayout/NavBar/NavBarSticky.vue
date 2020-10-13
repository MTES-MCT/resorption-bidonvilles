<template>
  <div class="fixed z-10 top-0 left-0 w-full bg-white shadow">
    <PublicContainer>
      <header
        role="navigation"
        class="py-4 flex flex-row justify-between items-center"
      >
        <NavBarLogo />
        <!-- Desktop actions -->
        <div class="hidden md:block">
          <router-link
            to="/contact"
            class="mr-2"
          >
            <Button variant="secondary">
              {{ $t('landingPage.header.contact') }}
            </Button>
          </router-link>
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
</template>

<script>
import NavBarLogo from './NavBarLogo';
import NavBarMobileMenu from './NavBarMobileMenu';
import NavBarMobileButton from './NavBarMobileButton';
import PublicContainer from '../PublicContainer';
import Button from '#app/components/ui/primitives/Button';

export default {
    components: {
        NavBarLogo,
        Button,
        NavBarMobileMenu,
        NavBarMobileButton,
        PublicContainer,
    },
    props: {
        menuDisplayed: {
            type: Boolean,
            required: true,
        },
        toggleMenu: {
            type: Function,
            required: true,
        },
        closeMenu: {
            type: Function,
            required: true,
        },
    },

};
</script>
