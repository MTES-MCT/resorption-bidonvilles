<template>
  <Dropdown>
    <template v-slot:button>
      <Button variant="primaryOutline" icon="chevron-down">
        <img v-if="language === 'fr'" width="24" height="24" src="./assets/img/languages/FR.svg"
          class="inline-block h-6" alt="Version Française" />
        <img v-if="language === 'en'" width="24" height="24" src="./assets/img/languages/UK.svg"
          class="inline-block h-6" alt="English version" />
        <img v-if="language === 'ro'" width="24" height="24" src="./assets/img/languages/RO.svg"
          class="inline-block h-6" alt="Versiunea Romaneasca" />
        <img v-if="language === 'bg'" width="24" height="24" src="./assets/img/languages/BG.svg"
          class="inline-block h-6" alt="Versiunea Bulgară" />
        {{ " " }}
        <span class="uppercase">{{ language }}</span>
      </Button>
    </template>
    <template v-slot:menu="{ closeMenu }">
      <Menu @click="closeMenu">
        <MenuItem @click="pickLang('fr')">
        <img src="./assets/img/languages/FR.svg" class="inline-block h-6" width="24" height="24"
          alt="Version Française" /> FR
        </MenuItem>
        <MenuItem @click="pickLang('en')">
        <img src="./assets/img/languages/UK.svg" class="inline-block h-6" width="24" height="24"
          alt="English version" /> EN
        </MenuItem>
        <MenuItem @click="pickLang('ro')">
        <img src="./assets/img/languages/RO.svg" class="inline-block h-6" width="24" height="24"
          alt="Versiunea Romaneasca" /> RO
        </MenuItem>
        <MenuItem @click="pickLang('bg')">
        <img src="./assets/img/languages/BG.svg" class="inline-block h-6" width="24" height="24"
          alt="Versiunea Bulgară" /> BG
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>

<script setup>
import { toRefs, defineProps, defineEmits } from 'vue';
import Dropdown from "./Dropdown.vue";
import Menu from "./Menu/Menu.vue";
import MenuItem from "./Menu/MenuItem.vue";
import Button from "./Button.vue";

const props = defineProps({
  language: {
    type: String,
  },
});
const { language } = toRefs(props);
const emit = defineEmits(['update:modelValue'])
function pickLang(lang) {
  emit('update:modelValue', lang)

}
</script>
