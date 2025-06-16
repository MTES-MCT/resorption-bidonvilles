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
             <input :disabled="isSubmitting || disabled" type="radio" :name="name" :value="value" v-model="props.modelValue" class="hidden appearance-none" @click="onClick" />
            <span class="!ml-3 pl-0">{{ label }}</span>
            <Icon v-if="value === props.modelValue" class="text-primary font-bold text-md" icon="fa-solid fa-check" />
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
import { toRefs } from 'vue';
import { useField, useIsSubmitting } from 'vee-validate';

const props = defineProps({
    name: String,
    label: String,
    value: [String, Boolean, Number],
    modelValue: String,
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
    small: {
        type: Boolean,
        required: false,
        default: true
    },
});

const { name, disabled } = toRefs(props);
const isSubmitting = useIsSubmitting();
const emit = defineEmits(['update:modelValue']);

const { handleChange } = useField(name, undefined, {
    type: 'radio',
    checkedValue: props.value,
    initialValue: props.modelValue
});

async function onClick() {
        await handleChange(props.value);
        emit('update:modelValue', props.value);
}
</script>
