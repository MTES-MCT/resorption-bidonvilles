<template>
  <div class="origin-top-right right-0 mt-2 w-48 rounded-md shadow-lg">
    <Menu>
      <MenuItem>
        <Link :to="`${WEBAPP_URL}/connexion`">
          {{ $t("landingPage.header.connect") }}
        </Link>
      </MenuItem>

      <MenuItem>
        <Link :to="`${WEBAPP_URL}/contact`">
          {{ $t("landingPage.header.contact") }}
        </Link>
      </MenuItem>
      <MenuItem>
        <LanguagePicker />
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
import { Link, Menu, MenuItem } from "@resorptionbidonvilles/ui";
import LanguagePicker from "./LanguagePicker";

export default {
  props: {
    closeMenu: {
      required: true,
      type: Function
    },
    displayLanguagePicker: {
      type: Boolean
    }
  },
  components: { Link, LanguagePicker, Menu, MenuItem },
  data() {
    const { WEBAPP_URL } = useRuntimeConfig();
    return {
        WEBAPP_URL
    };
  },
  mounted() {
    // Delay listener, otherwise the check happens before the menu is rendered and close the menu immediately
    setTimeout(() => {
      document.addEventListener("click", this.checkOutsideClick);
    }, 0);
  },
  destroyed() {
    document.removeEventListener("click", this.checkOutsideClick);
  },
  methods: {
    checkOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.closeMenu();
      }
    }
  }
};
</script>
