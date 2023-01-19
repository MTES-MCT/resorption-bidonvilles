<template>
    <form>
        <div class="flex items-center">
            <p class="font-bold text-lg">Partager une info</p>
            <Button
                :icon="showFullForm ? 'chevron-up' : 'chevron-down'"
                variant="text"
                class="text-primary"
                type="button"
                @click="toggleCollapse"
                >{{ showFullForm ? "Replier" : "Déplier" }}
            </Button>
        </div>

        <div class="bg-white p-6">
            <FormNouveauMessageInputMessage :rows="showFullForm ? 5 : 2" />
            <div v-if="showFullForm">
                <FormNouveauMessageInputTags />
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
                <ErrorSummary v-if="error" :message="error" class="mt-2" />
                <p class="text-right">
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

<script setup>
import { defineProps, toRefs, ref, watch } from "vue";
import { useForm } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import schema from "./FicheSiteJournalFormNouveauMessage.schema";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";
import FormNouveauMessageInputTags from "./inputs/FormNouveauMessageInputTags.vue";
import FormNouveauMessageInputMode from "./inputs/FormNouveauMessageInputMode.vue";
import FormNouveauMessageInputTarget from "./inputs/FormNouveauMessageInputTarget.vue";

const props = defineProps({
    town: Object,
    showFullForm: Boolean,
});
const { town, showFullForm } = toRefs(props);

const { handleSubmit, setErrors, resetForm, values } = useForm({
    validationSchema: schema,
    initialValues: {
        tags: [],
        mode: "public",
    },
});

const error = ref(null);
const emit = defineEmits(["show"]);

function toggleCollapse() {
    values.comment = "";
    emit("show", !showFullForm.value);
}
watch(values, () => {
    if (values.comment !== undefined && values.comment.length > 0) {
        emit("show", true);
    }
});

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
