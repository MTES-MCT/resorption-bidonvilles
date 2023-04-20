<template>
    <form>
        <h1 class="font-bold text-lg">Partager une info</h1>

        <div class="bg-white p-6">
            <FormNouveauMessageInputMessage />

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
import { toRefs, ref } from "vue";
import { useForm } from "vee-validate";
import { useActionsStore } from "@/stores/actions.store";
import schema from "./FicheActionJournalFormNouveauMessage.schema";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const { handleSubmit, setErrors, resetForm } = useForm({
    validationSchema: schema,
});

const error = ref(null);
const submit = handleSubmit(async (values) => {
    error.value = null;

    try {
        const actionsStore = useActionsStore();
        await actionsStore.addComment(action.value.id, {
            description: values.comment,
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
