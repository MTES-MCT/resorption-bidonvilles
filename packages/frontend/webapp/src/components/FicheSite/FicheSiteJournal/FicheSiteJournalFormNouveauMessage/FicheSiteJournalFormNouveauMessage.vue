<template>
    <form>
        <p class="font-bold text-lg">Partager une info</p>

        <div class="bg-white p-6">
            <FormNouveauMessageInputMessage :rows="rows" ref="messageInput" />
            <div
                class="transition-height h-0 overflow-hidden"
                ref="formContainer"
            >
                <FormNouveauMessageInputAttachments />
                <FormNouveauMessageInputTags />
                <FormNouveauMessageInputMode @click="onModeChange" />
                <FormNouveauMessageInputTarget
                    v-if="values.mode === 'custom'"
                    :departement="town.departement.code"
                />
                <p class="text-sm mb-4">
                    (*) Quelle que soit l'option retenue, les administrateurs
                    locaux et nationaux auront accès au message à des fins de
                    modération
                </p>
                <ErrorSummary v-if="error" :message="error" class="mt-2" />
                <p class="text-right space-x-2">
                    <Button
                        type="button"
                        icon="rotate-left"
                        iconPosition="left"
                        variant="secondary"
                        @click="resetForm"
                        >Annuler</Button
                    >
                    <Button
                        icon="paper-plane"
                        iconPosition="left"
                        @click="submit"
                        >Publier le message</Button
                    >
                </p>
            </div>
        </div>
    </form>
</template>

<style scoped>
.transition-height {
    transition-property: height;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>

<script setup>
import { defineProps, defineExpose, toRefs, ref, computed, watch } from "vue";
import { useForm } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import schema from "./FicheSiteJournalFormNouveauMessage.schema";
import router from "@/helpers/router";
import getHiddenHeight from "@/utils/getHiddenHeight";
import isDeepEqual from "@/utils/isDeepEqual";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";
import FormNouveauMessageInputTags from "./inputs/FormNouveauMessageInputTags.vue";
import FormNouveauMessageInputMode from "./inputs/FormNouveauMessageInputMode.vue";
import FormNouveauMessageInputTarget from "./inputs/FormNouveauMessageInputTarget.vue";
import FormNouveauMessageInputAttachments from "./inputs/FormNouveauMessageInputAttachments.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const initialValues = {
    comment: "",
    tags: [],
    mode: "public",
    target: {
        organizations: [],
        users: [],
    },
};
const { handleSubmit, setErrors, resetForm, values } = useForm({
    validationSchema: schema,
    initialValues,
});

const error = ref(null);
const formContainer = ref(null);
const messageInput = ref(null);
const rows = ref(2);
const isFocused = computed(() => messageInput.value?.isFocused);
let timeout;
const RESET_FORM = true;

watch(isFocused, () => {
    if (isFocused.value === true) {
        openForm();
    } else {
        timeout = setTimeout(onBlur, 200);
    }
});

function openForm() {
    rows.value = 5;
    formContainer.value.style.height = `${getHiddenHeight(
        formContainer.value
    )}px`;
}

function closeForm(reset = true) {
    rows.value = 2;
    formContainer.value.style.height = `0px`;

    if (reset === true) {
        resetForm();
    }
}

function onBlur() {
    if (isDeepEqual(values, initialValues)) {
        closeForm();
    }
}

function onModeChange() {
    formContainer.value.style.height = `auto`;
}

watch(values, () => {
    if (!isFocused.value && isDeepEqual(values, initialValues)) {
        closeForm(!RESET_FORM);
    } else {
        clearTimeout(timeout);
    }
});

const submit = handleSubmit(async (values) => {
    error.value = null;

    try {
        const townsStore = useTownsStore();
        await townsStore.addComment(town.value.id, {
            comment: values.comment,
            targets: {
                mode: values.mode,
                ...values.target,
            },
            tags: values.tags,
        });

        resetForm();

        // on rafraîchit la page pour avoir le site mis à jour
        router.push(`/site/${town.value.id}/#journal_du_site`);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

defineExpose({
    isFocused,
    focus: (...args) => messageInput.value.focus(...args),
});
</script>
