<template>
    <form>
        <p class="font-bold text-lg">Partager une info</p>

        <div class="bg-white p-6">
            <FormNouveauMessageInputMessage
                :rows="showFullForm ? 5 : 2"
                ref="messageInput"
            />
            <div v-if="showFullForm">
                <Button
                    :icon="collapse ? 'chevron-down' : 'chevron-up'"
                    variant="primaryText"
                    class="mb-4"
                    type="button"
                    :padding="false"
                    @click="toggleCollapse"
                    >{{
                        collapse ? "Voir plus d'options" : "Masquer les options"
                    }}
                </Button>

                <div v-if="!collapse">
                    <FormNouveauMessageInputTags />
                    <FormNouveauMessageInputMode />
                    <FormNouveauMessageInputTarget
                        v-if="values.mode === 'custom'"
                        :departement="town.departement.code"
                    />
                    <p class="text-sm mb-4">
                        (*) Quelle que soit l'option retenue, les
                        administrateurs locaux et nationaux auront accès au
                        message à des fins de modération
                    </p>
                    <ErrorSummary v-if="error" :message="error" class="mt-2" />
                    <p class="text-right space-x-2">
                        <Button
                            type="button"
                            icon="rotate-left"
                            iconPosition="left"
                            variant="secondary"
                            @click="cancel"
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
        </div>
    </form>
</template>

<script setup>
import { defineProps, defineExpose, toRefs, ref, computed } from "vue";
import { useForm } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import schema from "./FicheSiteJournalFormNouveauMessage.schema";
import router from "@/helpers/router";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";
import FormNouveauMessageInputTags from "./inputs/FormNouveauMessageInputTags.vue";
import FormNouveauMessageInputMode from "./inputs/FormNouveauMessageInputMode.vue";
import FormNouveauMessageInputTarget from "./inputs/FormNouveauMessageInputTarget.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const { handleSubmit, setErrors, resetForm, values } = useForm({
    validationSchema: schema,
    initialValues: {
        tags: [],
        mode: "public",
    },
});

const error = ref(null);
const collapse = ref(false);
const messageInput = ref(null);
const showFullForm = computed(() => {
    return messageInput.value?.isFocused === true || values.comment?.length > 0;
});

function cancel() {
    resetForm();
    collapse.value = false;
}

function toggleCollapse() {
    collapse.value = !collapse.value;
}

const submit = handleSubmit(async (values) => {
    error.value = null;

    try {
        const townsStore = useTownsStore();
        await townsStore.addComment(town.value.id, {
            description: values.comment,
            targets: {
                mode: values.mode,
                ...values.target,
            },
            tags: values.tags,
        });

        resetForm();
        collapse.value = false;

        // on rafraîchit la page pour avoir le site mis à jour
        router.push(`/site/${town.value.id}/#journal_du_site`);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

const isFocused = computed(() => messageInput.value?.isFocused);
defineExpose({
    isFocused,
    focus: (...args) => messageInput.value.focus(...args),
});
</script>
