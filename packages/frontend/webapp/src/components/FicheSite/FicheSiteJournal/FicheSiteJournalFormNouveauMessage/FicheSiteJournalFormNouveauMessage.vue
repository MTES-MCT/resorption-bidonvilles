<template>
    <form>
        <h1 class="font-bold text-lg">Partager une info</h1>

        <div class="bg-white p-6">
            <FormNouveauMessageInputMessage />
            <FormNouveauMessageInputTags />
            <template
                v-if="
                    userStore.hasPermission('shantytown_comment.createPrivate')
                "
            >
                <FormNouveauMessageInputMode />
                <FormNouveauMessageInputTarget
                    v-if="values.mode === 'custom'"
                    :departement="town.departement.code"
                />
                <p class="text-sm mb-4">
                    (*) Quelle que soit l'option retenue, les administrateurs
                    locaux et nationaux auront accès au message à des fins de
                    modération
                </p>
            </template>

            <ErrorSummary v-if="error" :message="error" class="mt-2" />
            <p class="text-right">
                <Button icon="paper-plane" iconPosition="left" @click="submit"
                    >Publier le message</Button
                >
            </p>
        </div>
    </form>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { useForm } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import schema from "./FicheSiteJournalFormNouveauMessage.schema";

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

const userStore = useUserStore();

const error = ref(null);
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
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});
</script>
