<template>
    <button type="button" :disabled="isSubmitting" :class="classes" :name="name" @click="onClick">
        {{ label }}
        <Icon v-if="variant === 'check' && checked" class="text-primary font-bold text-md" icon="check" />
    </button>
</template>

<script setup>
import { toRefs, computed } from 'vue';
import { useField, useIsSubmitting } from 'vee-validate';
import Icon from "../Icon.vue";

const props = defineProps({
    name: String,
    label: String,
    value: String,
    modelValue: String,
    variant: String, // soit "default", soit "check"
});

const { name, variant } = toRefs(props);
const isSubmitting = useIsSubmitting();

const { checked, handleChange } = useField(name, undefined, {
    type: 'radio',
    checkedValue: props.value,
    initialValue: props.modelValue
});

const variants = {
    default: {
        base: 'px-4 py-1 border border-blue200',
        checked: {
            [true]: 'bg-blue500 text-white border-blue500',
            [false]: 'bg-blue200 text-primary'
        },
        disabled: {
            [true]: 'opacity-50',
            [false]: 'hover:border-blue500'
        }
    },
    check: {
        base: 'px-4 py-2 flex items-center justify-between text-primary space-x-10 hover:bg-blue200',
        checked: {
            [true]: '',
            [false]: ''
        },
        disabled: {
            [true]: 'opacity-50 cursor-default',
            [false]: ''
        }
    }
};
const classes = computed(() => {
    let actualVariant = variant.value;
    if (!variants[variant.value]) {
        actualVariant = 'default';
    }

    const v = variants[actualVariant];
    return `${v.base} ${v.checked[checked.value === true]} ${v.disabled[isSubmitting.value === true]}`;
});

function onClick() {
    if (!checked.value) {
        handleChange(props.value);
    }
}
</script>