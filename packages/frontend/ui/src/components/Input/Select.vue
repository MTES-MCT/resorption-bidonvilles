<template>
    <SelectUi v-model="modelValue" v-bind="$attrs" :error="error" :disabled="disabled || isLoading || isSubmitting">
        <slot />
    </SelectUi>
</template>

<script setup>
import { toRefs, computed } from 'vue';
import { useField } from 'vee-validate';
import SelectUi from './SelectUi.vue';

const props = defineProps({
    name: String,
    disabled: {
        type: Boolean,
        default: false
    },
});

const { name, disabled } = toRefs(props);

const { value, handleChange, error, isSubmitting } = useField(name.value);
const modelValue = computed({
    get() {
        return value.value;
    },

    set(value) {
        handleChange(value);
    },
});
</script>