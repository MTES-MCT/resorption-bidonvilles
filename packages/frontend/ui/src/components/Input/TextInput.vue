<template>
    <Field :rules="rules" :name="id" v-slot="{ field, errors }" class="bg-white">
        <TextInputUi v-bind="{ ...$attrs, ...field }" :id="id" :errors="errors" :disabled="isSubmitting || disabled"
            ref="input">
            <template v-slot:suffix>
                <slot name="suffix" />
            </template>
        </TextInputUi>
    </Field>
</template>

<script setup>
import { toRefs, ref } from 'vue';
import { Field, useIsSubmitting } from "vee-validate";
import TextInputUi from './TextInputUi.vue';

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
    }
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
