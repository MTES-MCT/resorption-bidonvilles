<template>
    <button type="button" class="text-left" :class="direction === 'col' ? 'w-full' : ''" @click="onChange(value)"
        :disabled="isSubmitting || disabled">
        <template v-if="variant === 'checkbox'">
            <p class="flex">
                <span class="inline-block w-6 h-6 rounded border-2 align-middle mr-2 text-center"
                    :class="checkboxStyle">
                    <Icon icon="check" class="inline-block" :class="checked ? 'text-white' : 'text-transparent'" />
                </span>
                <span class="flex-1">
                    <slot>{{ label }}</slot>
                </span>
            </p>
        </template>
        <template v-else-if="variant === 'invisible'">
            <slot :checked="checked">{{ label }}</slot>
        </template>
        <template v-else><span class="inline-block px-4 py-1 border border-blue200" :class="[
            checked
                ? 'bg-blue500 text-white border-blue500'
                : 'bg-blue200 text-primary',
            isSubmitting ? 'opacity-50' : 'hover:border-blue500',
        ]">{{ label }}</span></template>
    </button>
</template> 

<script setup>
import { toRefs, computed, defineEmits } from 'vue';
import Icon from "../Icon.vue";

const props = defineProps({
    label: String,
    variant: {
        type: String,
        default: 'card' // soit "card", "checkbox", ou "invisible"
    },
    direction: { // soit 'row', soit 'col'
        type: String,
        default: 'row'
    },
    modelValue: {
        type: Boolean,
        required: false,
        default: false,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    isSubmitting: {
        type: Boolean,
        required: false,
        default: false
    }
});

const { label, variant, direction, modelValue: checked, disabled, isSubmitting } = toRefs(props);
const emit = defineEmits(['change', 'update:modelValue']);

function onChange() {
    emit('change', !checked.value);
    emit('update:modelValue', !checked.value);
}

const checkboxStyle = computed(() => {
    if (checked.value) {
        if (isSubmitting.value || disabled.value) {
            return 'bg-blue300 border-blue300';
        }

        return 'bg-primary border-primary';
    }

    if (isSubmitting.value || disabled.value) {
        return 'bg-G200 hover:border-G400';
    }

    return 'bg-white hover:border-G400';
});
</script>