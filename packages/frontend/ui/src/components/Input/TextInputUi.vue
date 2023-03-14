<template>
    <Input v-bind="$attrs" :id="id" :errors="errors" :disabled="disabled" ref="input" @changed="onChange"
        :defaultValue="modelValue">
    <template v-slot:suffix>
        <slot name="suffix" />
    </template>
    </Input>
</template>

<script setup>
import { defineProps, toRefs, ref, defineExpose, defineEmits } from 'vue';
import Input from "./Input.vue";

const props = defineProps({
    id: String,
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    errors: {
        type: Object,
        required: false
    },
    modelValue: [String, Number],
});

const input = ref(null);
const { id, disabled, errors, modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

defineExpose({
    focus: () => {
        input.value.focus();
    },
});

function onChange(value) {
    emit('update:modelValue', value);
}
</script>
