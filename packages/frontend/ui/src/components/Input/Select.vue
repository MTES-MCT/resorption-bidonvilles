<template>
    <InputWrapper
        :hasErrors="!!error"
        :withoutMargin="withoutMargin"
        :id="name"
    >
        <InputLabel :label="label" :info="info" />

        <div class="relative">
            <InputIcon position="before" :icon="icon" />
            <Field
                :class="classes"
                :value="defaultValue"
                :disabled="disabled || isLoading || isSubmitting"
                :name="name"
                as="select"
            >
                <slot />
            </Field>
            <InputIcon position="after" :icon="isLoading ? 'spinner' : 'chevron-down'" :spin="isLoading" />
        </div>
        <InputError v-if="!!error">{{ error }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { toRefs, computed } from 'vue';
import { useIsSubmitting, useFieldError, Field } from 'vee-validate';
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import InputIcon from "./utils/InputIcon.vue";
import getInputClasses from "./utils/getInputClasses";

const props = defineProps({
    name: String,
    label: String,
    info: String,
    value: String,
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
    }
});

const { name, variant, withoutMargin, disabled, isLoading, icon, info, label, value: defaultValue } = toRefs(props);
const isSubmitting = useIsSubmitting();
const error = useFieldError(name.value);

const classes = computed(() => {
    const inputOptions = {
        error: error.value,
        prefixIcon: icon.value,
        suffixIcon: true
    };

    const actualVariant = (disabled.value || isLoading.value || isSubmitting.value) ? 'disabled' : variant.value;
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
</script>