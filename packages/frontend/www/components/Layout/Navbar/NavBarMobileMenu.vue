<template>
  <div ref="navbarMobile" class="origin-top-right right-0 mt-2 w-48 rounded-md shadow-lg">
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

<script setup>
import { defineProps, toRefs, computed, ref, onMounted, onUnmounted, defineEmits } from "vue";


import { Link, Menu, MenuItem } from "@resorptionbidonvilles/ui";
import LanguagePicker from "./LanguagePicker";

const { WEBAPP_URL } = useRuntimeConfig();

const props = defineProps({
  closeMenu: {
    required: true,
    type: Function
  },
  displayLanguagePicker: {
    type: Boolean
  }
});

const emit = defineEmits(["closeMenu"]);

const navbarMobile = ref(null)

const { closeMenu, displayLanguagePicker } = toRefs(props);
onMounted(() => {
  // Delay listener, otherwise the check happens before the menu is rendered and close the menu immediately
  setTimeout(() => {
    document.addEventListener("click", checkOutsideClick);
  }, 0);
})

onUnmounted(() => {
  document.removeEventListener("click", checkOutsideClick);
})

function checkOutsideClick(event) {
  if (!navbarMobile.value.contains(event.target)) {
    emit('closeMenu');
  }
}
</script>
