<template>
    <Field name="password" v-slot="{ field, errors }">
        <DsfrInputGroup :error-message="errors[0]" :label="label" label-visible>
            <div class="fr-input-wrap password-input-wrapper">
                <input
                    id="password"
                    :name="field.name"
                    class="fr-input"
                    :class="{ 'fr-input--error': errors.length }"
                    :type="hidden ? 'password' : 'text'"
                    autocomplete="current-password"
                    required
                    :disabled="disabled"
                    :value="field.value"
                    @blur="field.onBlur"
                    @change="field.onChange"
                    @input="field.onChange"
                />
                <button
                    type="button"
                    class="password-toggle"
                    :aria-label="
                        hidden
                            ? 'Afficher le mot de passe'
                            : 'Masquer le mot de passe'
                    "
                    @click="hidden = !hidden"
                >
                    <VIcon :name="hidden ? 'ri:eye-line' : 'ri:eye-off-line'" />
                </button>
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

.password-input-wrapper input {
    padding-right: 3.5rem;
}

.password-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75rem;
    min-width: 48px;
    min-height: 48px;
    color: var(--text-action-high-grey);
    display: flex;
    align-items: center;
    justify-content: center;
}

.password-toggle:hover {
    color: var(--text-action-high-blue-france);
}

.password-toggle:focus-visible {
    outline: 2px solid var(--border-action-high-blue-france);
    outline-offset: 2px;
}
</style>
