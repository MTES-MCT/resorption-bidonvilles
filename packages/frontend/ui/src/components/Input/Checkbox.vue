<template>
    <button type="button" class="text-left" :class="direction === 'col' ? 'w-full' : ''" @click="onChange(value)"
        :disabled="isSubmitting">
        <template v-if="variant === 'checkbox'">
            <span class="inline-block w-6 h-6 rounded border-2 align-middle mr-2 text-center" :class="checkboxStyle">
                <Icon icon="check" class="text-white" :class="checked ? 'inline-block' : 'hidden'" />
            </span> {{ label }}
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
import { toRefs, computed } from 'vue';
import { useField, useIsSubmitting } from 'vee-validate';
import Icon from "../Icon.vue";

const props = defineProps({
    modelValue: [Array, String, Number],
    value: String,
    name: String,
    label: String,
    variant: {
        type: String,
        default: 'card'
    },
    direction: { // soit 'row', soit 'col'
        type: String,
        default: 'row'
    }
});

const { name, variant, value, direction } = toRefs(props);
const isSubmitting = useIsSubmitting();
const { checked, handleChange } = useField(name, undefined, {
    type: 'checkbox',
    checkedValue: props.value,
    initialValue: props.modelValue
});

function onChange() {
    handleChange(props.value);
}

const checkboxStyle = computed(() => {
    if (checked.value) {
        if (isSubmitting.value) {
            return 'bg-blue300 border-blue300';
        }

        return 'bg-primary border-primary';
    }

    if (isSubmitting.value) {
        return 'bg-G200 hover:border-G400';
    }

    return 'bg-white hover:border-G400';
});
</script>