<template>
    <CheckboxUi v-model="checkedModel" :isSubmitting="isSubmitting" />
</template> 

<script setup>
import CheckboxUi from "./CheckboxUi.vue";

import { defineProps, toRefs, computed } from 'vue';
import { useField, useIsSubmitting } from 'vee-validate';

const props = defineProps({
    name: String,
    value: [String, Number, Boolean],
    modelValue: {
        type: [Array, String, Number, Boolean],
        required: false,
        default: undefined,
    },
});
const { name, value, modelValue } = toRefs(props);

const isSubmitting = useIsSubmitting();
const { checked, handleChange } = useField(name.value, undefined, {
    type: 'checkbox',
    checkedValue: value.value,
    initialValue: modelValue.value
});
const checkedModel = computed({
    get() {
        return checked.value;
    },
    set(v) {
        if (v === checked.value) {
            return;
        }

        handleChange(value.value);
    }
});
</script>