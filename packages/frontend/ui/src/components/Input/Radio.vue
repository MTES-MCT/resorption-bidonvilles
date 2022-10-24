<template>
    <button type="button" @click="handleChange(value)" class="px-4 py-1 border border-blue200" :disabled="isSubmitting"
        :class="[
            checked ? 'bg-blue500 text-white border-blue500' : 'bg-blue200 text-primary',
            isSubmitting ? 'opacity-50' : 'hover:border-blue500'
        ]" :name="name">
        {{ label }}
    </button>
</template>

<script setup>
import { toRefs } from 'vue';
import { useField, useIsSubmitting } from 'vee-validate';

const props = defineProps({
    name: String,
    label: String,
    value: String,
});

const { name } = toRefs(props);
const isSubmitting = useIsSubmitting();

const { checked, handleChange } = useField(name, undefined, {
    type: 'radio',
    checkedValue: props.value
});
</script>