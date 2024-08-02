<template>
    <div class="fr-segmented__element text-xs">
        <input
            :id="id"
            type="radio"
            :name="name"
            :value="value"
            :checked="modelValue === value"
            :disabled="disabled"
            :aria-disabled="disabled"
            v-bind="$attrs"
            @change="handleChange"
        />
        <label :for="id" class="fr-label text-xs">
          <Icon v-if="icon" :icon="icon" class="text-blue600" />
            <span v-if="icon">&nbsp;</span>
            {{ label }}
        </label>
    </div>
</template>

<script lang="js" setup>
import { toRefs, computed } from 'vue'
import { Icon } from "@resorptionbidonvilles/ui";
import { default as getRandomId } from '../../utils/getRandomString.js';

const props = defineProps({
  hint: {type: String, default: ''},
  icon: {type: String, default: null},
  label: {type: String, default: ''},
  modelValue: {type: String, default: ''},
  name: {type: String, default: ''},
  value: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})

const { icon, label, modelValue, value, disabled, name } = toRefs(props);
const id = computed(() => getRandomId(4))
const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
@import "@gouvfr/dsfr/dist/dsfr.css";
@import "@gouvminint/vue-dsfr/styles";

.fr-segmented__element {
  --border-default-grey: var(--grey-900-175);
  --grey-900-175: #ddd;
  --border-active-blue-france: #000091;
  --text-active-blue-france: #000091;
}

.fr-segmented__element input:hover {
  --background-default-grey-hover: var(--grey-1000-50-hover);
  --grey-1000-50-hover: #f6f6f6;
}

.fr-segmented__element input:checked+label {
  box-shadow: inset 0 0 0 1px #000091;
  box-shadow: inset 0 0 0 1px var(--border-active-blue-france);
  color: #000091;
  color: var(--text-active-blue-france);
}
</style>