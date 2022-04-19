<template>
  <div class="fixed z-10 top-0 left-0 w-full bg-white shadow">
    <Container>
      <header
        role="navigation"
        class="py-4 flex flex-row justify-between items-center"
      >
        <NavBarLogo />
        <!-- Desktop actions -->
        <div class="hidden md:block">
          <slot name="anchors"></slot>

          <Link :to="`${WEBAPP_URL}/contact`" class="mr-2 inline-block">
            <Button variant="secondary">{{
              $t("landingPage.header.contact")
            }}</Button>
          </Link>
          <Link :to="`${WEBAPP_URL}/connexion`" class="inline-block">
            <Button variant="primary">{{
              $t("landingPage.header.connect")
            }}</Button>
          </Link>
        </div>

        <NavBarMobileButton class="md:hidden" :onClick="toggleMenu" />
      </header>
    </Container>
  </div>
</template>

<script>
import NavBarLogo from "./NavBarLogo.vue";
import NavBarMobileButton from "./NavBarMobileButton.vue";
import Container from "~/components/Layout/Container/Container.vue";
import { Link, Button } from "@resorptionbidonvilles/ui";

export default {
  props: {
    menuDisplayed: {
      type: Boolean,
      required: true
    },
    toggleMenu: {
      type: Function,
      required: true
    }
  },
  components: {
    NavBarLogo,
    Link,
    Button,
    NavBarMobileButton,
    Container
  },
  data() {
    const { WEBAPP_URL } = useRuntimeConfig();

    return {
        WEBAPP_URL
    };
  }
};
</script>
