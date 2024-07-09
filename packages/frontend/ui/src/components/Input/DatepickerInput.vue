<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <InputLabel :label="label" :info="info" :inlineInfo="inlineInfo" :showMandatoryStar="showMandatoryStar" :for="`dp-input-${id}`" />

        <div :class="width">
            <DatePicker v-model="date" locale="fr" :format-locale="fr" :format="departementMetricsStore.activeTab === 'evolution' ? 'LLLL yyyy' : 'dd LLLL yyyy'"
                :disabled="isSubmitting || disabled" autoApply :enableTimePicker="false"
                :input-class-name="focusClasses.ring"
                :preventMinMaxNavigation="$attrs.maxDate || $attrs.minDate" v-bind="$attrs" :uid="id">
            </DatePicker>
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

import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

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
});

const { id, name, label, info, inlineInfo, showMandatoryStar, rules, disabled, modelValue, width, withoutMargin } = toRefs(props);
const isSubmitting = useIsSubmitting();
const { handleChange, errors, value } = useField(name.value, rules.value, {
    initialValue: modelValue.value
});
const emit = defineEmits(["update:modelValue"]);
const departementMetricsStore = useDepartementMetricsStore();

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