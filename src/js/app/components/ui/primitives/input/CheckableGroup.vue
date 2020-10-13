<template>
  <ValidationProvider
    v-slot="{ errors }"
    :rules="rules"
    :name="validationName || title"
    :vid="id"
  >
    <InputGroup
      v-if="title"
      :id="id"
      :title="title"
      :info="info"
    >
      <div :class="'flex flex-col relative'">
        <div
          v-if="error"
          class="absolute h-full bg-error leftBorder"
        />
        <div :class="['flex', direction === 'vertical' ? 'flex-col checkableGroup--verticalLayout': 'flex-row flex-wrap checkableGroup--horizontalLayout']">
          <slot />
        </div>
      </div>
      <InputError>{{ errors[0] }}</InputError>
    </InputGroup>
    <InputWrapper
      v-else
      :id="id"
    >
      <div :class="'flex flex-col relative'">
        <div
          v-if="error"
          class="absolute h-full bg-error leftBorder"
        />
        <div :class="['flex', direction === 'vertical' ? 'flex-col checkableGroup--verticalLayout': 'flex-row checkableGroup--horizontalLayout']">
          <slot />
        </div>
      </div>
      <InputError>{{ errors[0] }}</InputError>
    </InputWrapper>
  </ValidationProvider>
</template>

<script>
import InputWrapper from './utils/InputWrapper.vue';
import InputError from './utils/InputError.vue';

export default {
    components: {
        InputWrapper,
        InputError,
    },
    props: {
        title: {
            type: String,
        },
        info: {
            type: String,
        },
        error: {
            type: String,
        },
        direction: {
            type: String,
            default: 'vertical',
        },
        validationName: {
            type: String,
        },
        rules: {
            type: String,
        },
        id: {
            type: String,
        },

    },
};
</script>

<style scoped>
    .leftBorder {
        width: 2px;
        left: -16px
    }
</style>

<style lang="scss">
    .checkableGroup--horizontalLayout {
        .checkbox-default,.checkbox-card,.radio-default,.radio-card {
            &:last-child {
                @apply mr-0 mb-0
            }

            @apply mr-4 mb-2
        }
    }

    .checkableGroup--verticalLayout {
        .checkbox-default,,.radio-default,.radio-card {
            &:last-child {
                @apply mb-0
            }

            @apply mb-6
        }

        .checkbox-card, .radio-card {
            @apply mb-2
        }
    }
</style>
