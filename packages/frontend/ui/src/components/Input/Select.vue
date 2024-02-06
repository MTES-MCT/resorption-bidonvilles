<template>
    <SelectUi v-model="modelValue" v-bind="$attrs" :error="error" :disabled="disabled || isLoading || isSubmitting">
        <slot />
    </SelectUi>
</template>

<script setup>
import { toRefs, computed } from 'vue';
import { useField, useFieldError } from 'vee-validate';
import SelectUi from './SelectUi.vue';

const props = defineProps({
    name: String,
    disabled: {
        type: Boolean,
        default: false
    },
});

const { name, disabled } = toRefs(props);

const { value, handleChange, isSubmitting } = useField(name.value);
const error = useFieldError(name.value);
const modelValue = computed({
    get() {
        return value.value;
    },

    set(value) {
        handleChange(value);
    },
});
</script>