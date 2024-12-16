<template>
  <select @change="pickLang($event.target.value)"
    :style="`background-image: url('assets/images/flags/${language.toUpperCase()}.svg'); background-position: 0.5rem center`"
    class="bg-[length:1.9rem] bg-no-repeat bg-white text-lg border-2 border-primary text-primary p-1 pl-12"
    :class="focusClasses.ring"
    name="language" label="Change language" :disabled="disabled">
    <option class="hover:bg-primary" v-for="lang in languages" :key="lang.key" :alt="lang.alt" :value="lang.key" :selected="lang.key === language.toLowerCase()"
      :lang="lang.key" @change="pickLang(lang.key)">
      {{ lang.label }}
    </option>
  </select>
</template>

<script setup>
import { toRefs } from 'vue';
import focusClasses from "../../../common/utils/focus_classes";

const props = defineProps({
  language: {
    type: String,
  },
});
const { language } = toRefs(props);

const languages = [
  { "key": "fr", "label": "Français", "alt": "Version Française", },
  { "key": "en", "label": "English", "alt": "English Version", },
  { "key": "ro", "label": "Românesc", "alt": "Versiunea în limba română", },
  { "key": "bg", "label": "Български", "alt": "Българска версия", },
];
const emit = defineEmits(['update:modelValue']);

function pickLang(lang) {
  emit('update:modelValue', lang)
}
</script>