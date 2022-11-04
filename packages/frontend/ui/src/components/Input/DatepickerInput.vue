<template>
    <InputWrapper :hasErrors="!!errors.length">
        <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" />

        <DatePicker v-model="date" locale="fr" :format-locale="fr" format="dd LLLL yyyy"
            :disabled="isSubmitting || disabled" autoApply :enableTimePicker="false" preventMinMaxNavigation
            v-bind="$attrs">
        </DatePicker>
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { useField, useIsSubmitting } from "vee-validate";
import { fr } from "date-fns/locale";

import InputWrapper from "./utils/InputWrapper.vue";
import InputLabel from "./utils/InputLabel.vue";

const props = defineProps({
    name: String,
    label: String,
    info: String,
    showMandatoryStar: Boolean,
    rules: {
        type: Object,
        required: false,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    modelValue: [Date, String]
});

const { name, label, info, showMandatoryStar, rules, disabled, modelValue } = toRefs(props);
const isSubmitting = useIsSubmitting();
const { handleChange, errors } = useField(name.value, rules.value, {
    initialValue: modelValue.value
});

const date = computed({
    get() {
        return modelValue.value;
    },
    set(newValue) {
        handleChange(newValue);
    }
});
</script>