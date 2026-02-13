<template>
    <Field name="password" v-slot="{ field, errors }">
        <div
            class="fr-input-group"
            :class="{ 'fr-input-group--error': errors.length }"
        >
            <label class="fr-label" for="password">
                {{ label }}&nbsp;<span class="required">*</span>
            </label>
            <div class="fr-input-wrap" style="position: relative">
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
                    style="padding-right: 2.5rem"
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
            <p v-if="errors.length" class="fr-error-text">
                {{ errors[0] }}
            </p>
        </div>
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
.password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--text-action-high-grey);
    display: flex;
    align-items: center;
}

.password-toggle:hover {
    color: var(--text-action-high-blue-france);
}
</style>
