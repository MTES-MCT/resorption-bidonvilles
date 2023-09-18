<template>
  <select @change="pickLang($event.target.value)"
    class="focus:ring-2 ring-offset-2 ring-info bg-white text-lg border-2 border-primary text-primary focus:outline-none p-2"
    name="language" label="Langue" :disabled="disabled">
    <option class="hover:bg-primary" v-for="lang in languages" :key="lang.key" :alt="lang.alt" :value="lang.key"
      :lang="lang.key" @change="pickLang(lang.key)">
      {{ lang.flag }} {{ lang.label }}
    </option>
  </select>
</template>

<script setup>
import { toRefs, defineProps, defineEmits } from 'vue';

const props = defineProps({
  language: {
    type: String,
  },
});
const { language } = toRefs(props);
const languages = [
  { key: 'fr', label: 'Français', alt: 'Version Française', flag: getFlagEmoji("fr") },
  { key: 'en', label: 'English', alt: 'English Version', flag: getFlagEmoji("en") },
  { key: 'ro', label: 'Românesc', alt: 'Versiunea în limba română', flag: getFlagEmoji("ro") },
  { key: 'bg', label: 'Български', alt: 'Българска версия', flag: getFlagEmoji("bg") },
];
const emit = defineEmits(['update:modelValue']);
function pickLang(lang) {
  emit('update:modelValue', lang)
}
function getFlagEmoji(countryCode) {
  switch (countryCode) {
    case 'fr':
      return "🇫🇷";
    case 'en':
      return "🇬🇧";
    case 'ro':
      return "🇷🇴";
    case 'bg':
      return "🇧🇬";
    default:
      return "🇫🇷";
  }
}
</script>
<style scoped>
select.decorated option:hover {
  box-shadow: 0 0 10px 100px #1882A8 inset;
}
</style>