<template>
  <div>
    <div :class="!sticky && 'hidden'">
      <NavBarSticky :menuDisplayed="menuDisplayed" :toggleMenu="toggleMenu">
        <template v-slot:anchors>
          <div class="mr-8 hidden xl:inline-block space-x-5">
            <slot name="anchors"></slot>
          </div>
        </template> 
      </NavBarSticky> 
    </div>

    <div :class="sticky && 'hidden'">
      <Container>
        <header
          role="navigation"
          class="py-4 flex flex-row justify-between items-center"
        >
          <NavBarLogo />

          <div class="hidden md:flex flex-row items-center">
            <div class="mr-8 hidden xl:block flex space-x-5">
              <slot name="anchors"></slot>
            </div>

            <div>
               <Link to="https://blog-resorption-bidonvilles.fr">
                <Button variant="primary">Blog</Button>
              </Link>
              <Link :to="`${WEBAPP_URL}/connexion`" class="ml-2">
                <Button variant="primary">{{
                  $t("landingPage.header.connect")
                }}</Button>
              </Link>
            </div>
            <LanguagePicker v-if="displayLanguagePicker" class="ml-2" />
          </div>

          <NavBarMobileButton class="md:hidden" :onClick="toggleMenu" />
        </header>
      </Container>
    </div>
    <NavBarMobileMenu
      class="fixed top-0 right-0 mt-16 z-10"
      v-if="menuDisplayed"
      :closeMenu="closeMenu"
      :displayLanguagePicker="displayLanguagePicker"
    />
  </div>
</template>

<script>
import NavBarLogo from "./NavBarLogo.vue";
import NavBarSticky from "./NavBarSticky.vue";
import LanguagePicker from "./LanguagePicker";
import NavBarMobileButton from "./NavBarMobileButton.vue";
import NavBarMobileMenu from "./NavBarMobileMenu.vue";
import Container from "~/components/Layout/Container/Container.vue";
import { Link, Button } from "@resorptionbidonvilles/ui";

export default {
  props: {
    stickyHeader: {
      type: Boolean
    },
    displayLanguagePicker: {
      type: Boolean,
      default: true
    }
  },
  components: {
    NavBarLogo,
    NavBarSticky,
    Link,
    Button,
    NavBarMobileMenu,
    NavBarMobileButton,
    Container,
    LanguagePicker
  },
  data() {
    const { WEBAPP_URL } = useRuntimeConfig();

    return {
      WEBAPP_URL,
      scrollTop: 0,
      menuDisplayed: false
    };
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
    }
  },
  computed: {
    sticky() {
      return this.scrollTop > 200 && this.stickyHeader;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
