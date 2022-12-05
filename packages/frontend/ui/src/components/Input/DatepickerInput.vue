<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" />

        <div :class="width">
            <DatePicker v-model="date" locale="fr" :format-locale="fr" format="dd LLLL yyyy"
                :disabled="isSubmitting || disabled" autoApply :enableTimePicker="false" preventMinMaxNavigation
                v-bind="$attrs">
            </DatePicker>
        </div>
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { computed, defineProps, toRefs, defineEmits } from "vue";
import { useField, useIsSubmitting } from "vee-validate";
import { fr } from "date-fns/locale";

import InputWrapper from "./utils/InputWrapper.vue";
import InputLabel from "./utils/InputLabel.vue";
import InputError from "./utils/InputError.vue";

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
    modelValue: {
        type: [Date, String],
        required: false,
        default: null
    },
    width: { // tailwind class (par exemple : w-32)
        type: String,
        required: false,
        default: ""
    },
    withoutMargin: {
        type: Boolean,
        required: false,
        default: false
    },
});

const { name, label, info, showMandatoryStar, rules, disabled, modelValue, width, withoutMargin } = toRefs(props);
const isSubmitting = useIsSubmitting();
const { handleChange, errors, value } = useField(name.value, rules.value, {
    initialValue: modelValue.value
});
const emit = defineEmits(["update:modelValue"]);

const date = computed({
    get() {
        return value.value;
    },
    set(newValue) {
        handleChange(newValue);
        emit("update:modelValue", newValue);
    }
});
</script>