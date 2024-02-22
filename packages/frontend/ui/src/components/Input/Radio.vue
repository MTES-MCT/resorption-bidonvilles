<template>
    <template v-if="variant === 'radio'">
        <label class="inline-block px-2 py-2 flex items-center cursor-pointer">
            <input :disabled="isSubmitting || disabled" type="radio" :name="name" @click="onClick" :class="classes" :checked="checked" />
            <span>{{ label }}</span>
        </label>
    </template>

    <!-- Variant "check" -->
    <template v-else-if="variant === 'check'">
        <label :class="[classes,
            isSubmitting || disabled ? 'opacity-85' : 'hover:border-blue500',
        ]">
            <input :disabled="isSubmitting || disabled" type="radio" :name="name" @click="onClick" class="appearance-none" :checked="checked" />
            <span>{{ label }}</span>
            <Icon v-if="checked" class="text-primary font-bold text-md" icon="fa-solid fa-check" />
        </label>
    </template>

    <template v-else>
        <label class="inline-block border-2 cursor-pointer" :class="classes">
            <input :disabled="isSubmitting || disabled" type="radio" :name="name" @click="onClick" class="inline-block rounded mr-2 text-center"
                :checked="checked" />
            {{ label }}
        </label>
    </template>
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
            [true]: 'bg-primary text-white border-blue500',
            [false]: 'bg-blue200 text-primary'
        },
        disabled: {
            [true]: 'opacity-85',
            [false]: 'hover:border-blue500'
        }
    },
    check: {
        base: 'inline-block cursor-pointer pr-4 py-2 text-primary space-x-10 hover:bg-blue200',
        checked: {
            [true]: '',
            [false]: ''
        },
        disabled: {
            [true]: 'opacity-85 cursor-default',
            [false]: ''
        }
    },
    radio: {
        base: 'appearance-none inline-block rounded-full mr-2 text-white border border-G500 w-3 h-3',
        checked: {
            [true]: 'bg-primary border-primary',
            [false]: 'bg-white border_G600'
        },
        disabled: {
            [true]: 'opacity-85 cursor-default',
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
