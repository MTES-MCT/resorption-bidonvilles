<template>
  <Dropdown>
    <template v-slot:button>
      <Button variant="primaryOutline" icon="chevron-down">
        <img
          v-if="$i18n.locale === 'fr'"
          width="24"
          height="24"
          src="~/assets/img/Navbar/FR.svg"
          class="inline-block h-6"
          alt="Version Française"
        />
        <img
          v-if="$i18n.locale === 'en'"
          width="24"
          height="24"
          src="~/assets/img/Navbar/UK.svg"
          class="inline-block h-6"
          alt="English version"
        />
        <img
          v-if="$i18n.locale === 'ro'"
          width="24"
          height="24"
          src="~/assets/img/Navbar/RO.svg"
          class="inline-block h-6"
          alt="Versiunea Romaneasca"
        />
        <img
          v-if="$i18n.locale === 'bg'"
          width="24"
          height="24"
          src="~/assets/img/Navbar/BG.svg"
          class="inline-block h-6"
          alt="Versiunea Bulgară"
        />
        {{ " " }}
        <span class="uppercase">{{ $i18n.locale }}</span>
      </Button>
    </template>
    <template v-slot:menu="{ closeMenu }">
      <Menu @click="closeMenu">
        <MenuItem @click="pickLang('fr')">
          <img src="~/assets/img/Navbar/FR.svg" class="inline-block h-6" width="24" height="24" alt="Version Française" /> FR
        </MenuItem>
        <MenuItem @click="pickLang('en')">
          <img src="~/assets/img/Navbar/UK.svg" class="inline-block h-6" width="24" height="24" alt="English version" /> EN
        </MenuItem>
        <MenuItem @click="pickLang('ro')">
          <img src="~/assets/img/Navbar/RO.svg" class="inline-block h-6" width="24" height="24" alt="Versiunea Romaneasca" /> RO
        </MenuItem>
        <MenuItem @click="pickLang('bg')">
          <img src="~/assets/img/Navbar/BG.svg" class="inline-block h-6" width="24" height="24" alt="Versiunea Bulgară" /> BG
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>

<script>
import { Dropdown, Menu, MenuItem, Button } from "@resorptionbidonvilles/ui";

export default {
  components: {
    Dropdown,
    Menu,
    MenuItem,
    Button
  },
  methods: {
    pickLang(lang) {
      this.$i18n.locale = lang;
    }
  }
};
</script>
