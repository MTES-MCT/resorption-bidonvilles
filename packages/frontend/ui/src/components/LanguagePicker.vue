<template>
  <select @change=" pickLang($event.target.value)"
    :style="`background-image: url('assets/images/flags/${selectedLang}.svg');`"
    class="bg-[length:30px] bg-left bg-[.5rem] bg-no-repeat focus:ring-2 ring-offset-2 ring-info bg-white text-lg border-2 border-primary text-primary focus:outline-none p-2 pl-12"
    name="language" :label="language === 'fr' ? 'Changer la langue' : 'Change language'" :disabled="disabled">
    <option class="hover:bg-primary" v-for="lang in languages" :key="lang.key" :alt="lang.alt" :value="lang.key"
      :lang="lang.key" @change="pickLang(lang.key)">
      {{ lang.label }}
    </option>
  </select>
</template>

<script setup>
import { ref, toRefs } from 'vue';

const props = defineProps({
  language: {
    type: String,
  },
});
const { language } = toRefs(props);
const selectedLang = ref("FR");

const languages = [
  { "key": "fr", "label": "Français", "alt": "Version Française", },
  { "key": "en", "label": "English", "alt": "English Version", },
  { "key": "ro", "label": "Românesc", "alt": "Versiunea în limba română", },
  { "key": "bg", "label": "Български", "alt": "Българска версия", },
];
const emit = defineEmits(['update:modelValue']);
function pickLang(lang) {
  selectedLang.value = lang === "en" ? "UK" : lang.toUpperCase();
  emit('update:modelValue', lang)
}
</script>