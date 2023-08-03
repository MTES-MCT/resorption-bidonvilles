<template>
    <button type="button" :disabled="isSubmitting || disabled" :class="classes" :name="name" @click="onClick" class="focus:outline-none focus:ring-2 ring-offset-2 ring-info">
        <span v-if="variant === 'radio'"
            class="inline-flex items-center justify-center rounded-full border w-5 h-5 text-white"
            :class="checked ? 'bg-primary border-primary' : ''">
            <Icon v-if="checked" icon="check" class="text-xs" />
        </span>
        <span>{{ label }}</span>
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
    value: [String, Boolean, Number],
    modelValue: String,
    variant: String, // soit "default", soit "check", soit "radio"
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    allowNull: {
        type: Boolean,
        required: false,
        default: false,
    },
    nullValue: {
        type: [Object, String, Boolean, Number],
        required: false,
        default: undefined
    },
});

const { name, variant, disabled, allowNull, nullValue } = toRefs(props);
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
    },
    radio: {
        base: 'flex items-center space-x-2',
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
    return `${v.base} ${v.checked[checked.value === true]} ${v.disabled[(disabled.value || isSubmitting.value) === true]}`;
});

function onClick() {
    if (!checked.value) {
        handleChange(props.value);
    } else if (allowNull.value === true) {
        handleChange(nullValue.value);
    }
}
</script>