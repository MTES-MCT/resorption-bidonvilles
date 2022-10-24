<template>
    <Field
        :rules="rules"
        :name="id"
        v-slot="{ field, errors }">
        <Input v-bind="{ ...$attrs, ...field }" :id="id" :errors="errors" :disabled="isSubmitting || disabled" ref="input">
            <template v-slot:suffix><slot name="suffix" /></template>
        </Input>
    </Field>
</template>

<script setup>
import { defineProps, toRefs, ref, defineExpose } from 'vue';
import { Field, useIsSubmitting } from "vee-validate";
import Input from "./Input.vue";

const props = defineProps({
    id: String,
    rules: {
        type: Object,
        required: false,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
});

const input = ref(null);
const { id, rules, disabled } = toRefs(props);
const isSubmitting = useIsSubmitting();

defineExpose({
    focus: () => {
        input.value.focus();
    },
});
</script>
