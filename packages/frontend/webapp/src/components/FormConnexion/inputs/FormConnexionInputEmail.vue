<template>
    <Field name="email" v-slot="{ field, errors }">
        <DsfrInputGroup :error-message="errors[0]">
            <DsfrInput
                id="email"
                :name="field.name"
                :label="label"
                label-visible
                placeholder="marcel.dupont@exemple.fr"
                autocomplete="username"
                type="email"
                required
                :is-invalid="!!errors.length"
                :disabled="disabled"
                :model-value="field.value"
                @blur="field.onBlur"
                @change="field.onChange"
                @input="field.onChange"
            />
        </DsfrInputGroup>
    </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import labels from "../FormConnexion.labels.js";

defineProps({
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const { email: label } = labels;
</script>
