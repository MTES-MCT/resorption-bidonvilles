<template>
    <DsfrRadioButtonSet class="bg-blue200 border-2 hover:bg-blue300 hover:border-blue500 content-center p-1 pt-1.5 h-10" >
        <DsfrRadioButton
            :v-model="props.modelValue"
            :label="label"
            :name="name"
            :disabled="isSubmitting || disabled"
            :value="value"
            @click="onClick"
            :small="small"
        />
    </DsfrRadioButtonSet>
</template>
<script setup>
import { toRefs } from 'vue';
import { useField, useIsSubmitting } from 'vee-validate';

const props = defineProps({
    name: String,
    label: String,
    value: [String, Boolean, Number],
    modelValue: String,
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    allowNull: {
        type: Boolean,
        required: false,
        default: false,
    },
    nullValue: {
        type: [Object, String, Boolean, Number],
        required: false,
        default: undefined
    },
    small: {
        type: Boolean,
        required: false,
        default: true
    },
});

const { name, disabled } = toRefs(props);
const isSubmitting = useIsSubmitting();
const emit = defineEmits(['update:modelValue']);

const { handleChange } = useField(name, undefined, {
    type: 'radio',
    checkedValue: props.value,
    initialValue: props.modelValue
});

async function onClick() {
        await handleChange(props.value);
        emit('update:modelValue', props.value);
}
</script>
