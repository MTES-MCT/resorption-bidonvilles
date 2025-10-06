<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <InputLabel
            :label="label"
            :info="info"
            :inlineInfo="inlineInfo"
            :showMandatoryStar="showMandatoryStar"
            :for="`dp-input-${id}`"
            :error="!!errors.length"
        />

        <div :class="width" class="mt-3">
            <DatePicker
                v-model="date"
                locale="fr"
                :format-locale="fr"
                :format="(monthPicker || section === 'evolution') ? 'LLLL yyyy' : 'dd LLLL yyyy'"
                :disabled="isSubmitting || disabled"
                autoApply
                :enableTimePicker="false"
                :input-class-name="focusClasses.ring"
                :preventMinMaxNavigation="!!$attrs.maxDate || !!$attrs.minDate"
                :monthPicker="monthPicker"
                v-bind="$attrs"
                :uid="id"
            />
        </div>
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { computed, defineProps, toRefs, defineEmits } from "vue";
import { useField, useIsSubmitting } from "vee-validate";
import { fr } from "date-fns/locale";
import focusClasses from "../../../../common/utils/focus_classes";

import InputWrapper from "./utils/InputWrapper.vue";
import InputLabel from "./utils/InputLabel.vue";
import InputError from "./utils/InputError.vue";

const props = defineProps({
    id: String,
    name: String,
    label: String,
    info: String,
    inlineInfo: {
        type: Boolean,
        required: false,
        default: false,
    },
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
        default: undefined
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
    section: {
        required: false,
        type: String
    },
    monthPicker: {
        type: Boolean,
        required: false,
        default: false
    }
});

const { id, name, label, info, inlineInfo, showMandatoryStar, rules, disabled, modelValue, width, withoutMargin, section, monthPicker } = toRefs(props);
const isSubmitting = useIsSubmitting();
const { handleChange, errors, value } = useField(name.value, rules.value, {
    initialValue: modelValue.value
});
const emit = defineEmits(["update:modelValue"]);

const date = computed({
    get() {
        if (monthPicker.value && value.value instanceof Date) {
            const d = value.value;
            if (!isValidDate(d)) return null;
            return {
                month: d.getMonth(),
                year: d.getFullYear()
            };
        }
        return value.value;
    },
    set(newValue) {
        const out = processDateValue(newValue, monthPicker.value);
        if (out !== null) {
            handleChange(out);
            emit("update:modelValue", out);
        }
    }
});

function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}

function processDateValue(newValue, isMonthPicker) {
    if (isMonthPicker && newValue && typeof newValue === 'object' && 'month' in newValue) {
        const date = new Date(newValue.year, newValue.month, 1);
        return isValidDate(date) ? date : null;
    }
    
    if (newValue != null && !(newValue instanceof Date)) {
        const date = new Date(newValue);
        return isValidDate(date) ? date : null;
    }
    
    return newValue;
}
</script>