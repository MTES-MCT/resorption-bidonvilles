<template>
    <div class="fr-form-group">
        <fieldset
            class="fr-segmented"
            :class="{
                'fr-segmented--sm': small,
                'fr-segmented--no-legend': !legend,
            }"
            :disabled="disabled"
        >
            <legend
                v-if="legend"
                :id="titleId"
                class="fr-segmented__legend"
                :class="{
                    'fr-segmented__legend--inline': inline,
                }"
            >
                <slot name="legend">
                    {{ legend }}
                </slot>
                <span v-if="hint" class="fr-hint-text">
                    {{ hint }}
                </span>
            </legend>

            <div class="fr-segmented__elements">
                <slot>
                    <Segmented
                        v-for="(option, i) of options"
                        :key="option.value || i"
                        :name="name || option.name"
                        v-bind="{
                            ...option,
                            disabled: disabled || option.disabled,
                        }"
                        v-model="localValue"
                    />
                </slot>
            </div>
        </fieldset>
    </div>
    <DsfrSegmented />
</template>

<script lang="js" setup>
import { toRefs, computed } from 'vue'
import Segmented from './DsfrSegmented.vue'
import { default as getRandomId } from '../../utils/getRandomString.js'

const props = defineProps({
  titleId: () => getRandomId('radio-button', 'group'),
  legend: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'no-name'
},
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  small: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const { titleId, legend, name, options } = toRefs(props);


const emit = defineEmits(['update:modelValue'])

const onChange = ($event) => {
  if ($event === props.modelValue) {
    return
  }
  emit('update:modelValue', $event)
}

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
@import "@gouvfr/dsfr/dist/dsfr.css";
@import "@gouvminint/vue-dsfr/styles";

.fr-segmented__elements {
  --border-default-grey: var(--grey-900-175);
  --grey-900-175: #ddd;
  @apply verticalSet;
}

@media (screen(lg)) {
  .fr-segmented__elements {
    @apply horizontalSet
  }
}

.verticalSet {
  flex-direction: column;
  margin-left: 0;
}

.horizontalSet {
  flex-direction: row;
  margin-left: 0;
}
</style>
