<template>
    <Field name="password" v-slot="{ field, errors }">
        <DsfrInputGroup :error-message="errors[0]" :label="label" label-visible>
            <div class="password-input-wrapper">
                <DsfrInput
                    id="password"
                    :name="field.name"
                    :type="hidden ? 'password' : 'text'"
                    autocomplete="current-password"
                    required
                    :is-invalid="!!errors.length"
                    :disabled="disabled"
                    :model-value="field.value"
                    @blur="field.onBlur"
                    @change="field.onChange"
                    @input="field.onChange"
                />
                <DsfrButton
                    type="button"
                    tertiary
                    no-outline
                    class="password-toggle"
                    :icon="hidden ? 'ri-eye-line' : 'ri-eye-off-line'"
                    :aria-label="
                        hidden
                            ? 'Afficher le mot de passe'
                            : 'Masquer le mot de passe'
                    "
                    @click="hidden = !hidden"
                />
            </div>
        </DsfrInputGroup>
    </Field>
</template>

<script setup>
import { ref } from "vue";
import { Field } from "vee-validate";
import labels from "../FormConnexion.labels.js";

defineProps({
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const hidden = ref(true);
const { password: label } = labels;
</script>

<style scoped>
.password-input-wrapper {
    position: relative;
}

.password-input-wrapper :deep(input) {
    padding-right: 3.5rem;
}

.password-toggle {
    position: absolute;
    right: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
}
</style>
