<template>
    <Field :name="validationName || id" :rules="rules" v-slot="{ field, errors, handleChange }" as="div">
        <InputWrapper :hasErrors="!!errors.length">
            <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" :for="id" />

            <div class="relative">
                <InputIcon position="before" :icon="prefixIcon" v-if="prefixIcon" />
                <DsfrInput
                    isTextarea
                    ref="textarea"
                    :id="id"
                    :data-cy-field="cypressName"
                    :disabled="isSubmitting || disabled"
                    class="h-40"
                    :class="['bg-white', classes]"
                    :model-value="field.value"
                    @update:model-value="handleChange"
                    @blur="onBlur"
                />
                <InputIcon position="after" :icon="suffixIcon" v-if="suffixIcon" />
            </div>
            <InputError v-if="errors.length">{{ errors[0] }}</InputError>
        </InputWrapper>
    </Field>
</template>

<script setup>
import { ref, computed } from "vue";
import { Field, useIsSubmitting } from "vee-validate";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import InputIcon from "./utils/InputIcon.vue";
import getInputClasses from "./utils/getInputClasses";

const props = defineProps({
    label: String,
    info: String,
    placeholder: String,
    rules: String,
    validationName: String,
    id: { type: String, required: true },
    variant: {
        type: String,
        default: "default"
    },
    prefixIcon: String,
    suffixIcon: String,
    rows: [String, Number],
    cols: String,
    cypressName: String,
    showMandatoryStar: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['blur']);

const isSubmitting = useIsSubmitting();
const textarea = ref(null);

const classes = computed(() => {
    const inputOptions = {
        prefixIcon: props.prefixIcon,
        suffixIcon: props.suffixIcon,
        disabled: props.disabled
    };

    return {
        state: [...getInputClasses("state", inputOptions)],
        default: getInputClasses("default", inputOptions)
    }[props.variant];
});

const onBlur = (event) => {
    emit('blur', event);
};

const focus = () => {
    textarea.value?.focus();
};

// Exposer la méthode 'focus' au composant parent
defineExpose({
    focus,
});
</script>