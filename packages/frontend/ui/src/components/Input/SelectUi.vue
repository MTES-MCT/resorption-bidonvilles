<template>
    <InputWrapper :hasErrors="!!error" :withoutMargin="withoutMargin" :id="name">
        <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" />

        <div class="relative">
            <InputIcon position="before" :icon="icon" />
            <select :class="classes" :value="modelValue" :disabled="disabled || isLoading" @change="onChange">
                <slot />
            </select>
            <InputIcon class="absolute pointer-events-none" position="after" :icon="isLoading ? 'spinner' : 'chevron-down'"
                :spin="isLoading" />
        </div>
        <InputError v-if="!!error">{{ error }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { toRefs, computed, defineEmits } from 'vue';
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import InputIcon from "./utils/InputIcon.vue";
import getInputClasses from "./utils/getInputClasses";

const props = defineProps({
    name: String,
    label: String,
    info: String,
    error: String,
    icon: String,
    isLoading: {
        type: Boolean,
        default: false
    },
    withoutMargin: {
        type: Boolean
    },
    variant: {
        type: String,
        default: "default"
    },
    disabled: {
        type: Boolean,
        default: false
    },
    showMandatoryStar: {
        type: Boolean,
        default: false,
    },
    modelValue: [String, Number, Boolean],
});

const { name, variant, withoutMargin, disabled, isLoading, icon, info, error, label, showMandatoryStar, modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const classes = computed(() => {
    const inputOptions = {
        error: error.value,
        prefixIcon: icon.value,
        suffixIcon: true
    };

    const actualVariant = (disabled.value || isLoading.value) ? 'disabled' : variant.value;
    return {
        state: [
            "appearance-none",
            ...getInputClasses("state", inputOptions)
        ],
        default: [
            "appearance-none",
            ...getInputClasses("default", inputOptions)
        ],
        link: [
            "appearance-none",
            "font-bold",
            "bg-transparent",
            "text-info",
            "underline",
            "pr-8",
            "cursor-pointer"
        ],
        disabled: [
            "appearance-none",
            ...getInputClasses("default", inputOptions),
            "bg-G100"
        ]
    }[actualVariant];
});

function onChange(e) {
    emit('update:modelValue', e.srcElement.value);
}
</script>