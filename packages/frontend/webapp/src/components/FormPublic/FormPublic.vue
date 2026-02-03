<template>
    <Form
        :validation-schema="schema"
        @submit="formSubmit"
        ref="form"
        v-slot="{ values, errors }"
        :lang="language"
    >
        <!-- form header (title and description) -->
        <header class="text-center mb-8">
            <p
                class="text-lg sm:text-xl font-bold text-secondary"
                v-if="$slots.subtitle"
            >
                <slot name="subtitle"></slot>
            </p>
            <h1 class="text-2xl sm:text-3xl font-bold">
                <slot name="title"></slot>
            </h1>
            <p class="px-3" :class="$slots.description ? 'mt-6' : ''">
                <slot name="description"></slot>
            </p>
            <p
                class="px-3 text-error"
                :class="$slots.alert ? 'mt-6' : ''"
                role="alert"
            >
                <slot name="alert"></slot>
            </p>
        </header>

        <!-- form body -->
        <ContentWrapper :size="size">
            <slot name="body" :values="values"></slot>
        </ContentWrapper>

        <!-- form errors (always small) -->
        <ContentWrapper size="small">
            <ErrorSummary
                v-if="error || Object.keys(errors).length > 0"
                :message="error || 'Certaines données sont incorrectes'"
                :summary="showErrorSummary ? errors : {}"
            />
        </ContentWrapper>

        <!-- form buttons -->
        <ContentWrapper :size="size">
            <slot
                name="button"
                class="border-2 border-red400"
                :disabled="Boolean(error) || Object.keys(errors).length > 0"
            >
                <p class="text-center">
                    <DsfrButton type="submit">Envoyer</DsfrButton>
                </p>
            </slot>
        </ContentWrapper>

        <!-- footer with additional action items -->
        <div class="mt-10" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </Form>
</template>

<script setup>
import { defineProps, defineExpose, toRefs, ref } from "vue";
import { Form } from "vee-validate";

import { ContentWrapper, ErrorSummary } from "@resorptionbidonvilles/ui";

const props = defineProps({
    schema: Object,
    submit: Function,
    size: {
        type: String,
        default: "medium",
    },
    showErrorSummary: {
        type: Boolean,
        default: true,
    },
    language: {
        type: String,
        default: "fr",
    },
});

const form = ref(null);
const error = ref(null);
const { schema, submit, size, showErrorSummary, language } = toRefs(props);

async function formSubmit(...args) {
    error.value = null;

    try {
        await submit.value(...args);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        form.value.setErrors(e?.fields || {});
    }
}

defineExpose({
    resetForm(...args) {
        return form.value.resetForm(...args);
    },
    setError(message, errors = {}) {
        error.value = message;
        form.value.setErrors(errors);
    },
    setFieldValue(...args) {
        return form.value.setFieldValue(...args);
    },
});
</script>
