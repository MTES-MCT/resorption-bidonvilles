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
import { defineProps, toRefs, ref } from "vue";
import { useForm } from "vee-validate";
import { usePlansStore } from "@/stores/plans.store";
import schema from "./FicheActionJournalFormNouveauMessage.schema";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const { handleSubmit, setErrors, resetForm } = useForm({
    validationSchema: schema,
});

const error = ref(null);
const submit = handleSubmit(async (values) => {
    error.value = null;

    try {
        const plansStore = usePlansStore();
        await plansStore.addComment(plan.value.id, {
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
