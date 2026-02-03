<template>
    <form>
        <div class="bg-blue100 p-4 flex items-start space-x-2 mb-4">
            <p><Icon icon="circle-info" class="text-primary" /></p>
            <div>
                <p>
                    En sélectionnant vos domaines de compétence et sujets
                    d'intérêt ci-dessous, la plateforme évoluera afin de vous
                    offrir une interface, des outils, et du contenu plus
                    personnalisés et donc adaptés à vos besoins.
                </p>
                <p class="mt-2">
                    Cette sélection peut être modifiée à tout moment et n'a pour
                    but que d'améliorer votre expérience sur la plateforme.
                </p>
            </div>
        </div>

        <FormSujetsInputSujetsExpertise />
        <FormSujetsInputSujetsInteret />
        <FormSujetsInputCommentaire />

        <ErrorSummary
            v-if="error || Object.keys(errors).length > 0"
            :message="error || 'Certaines données sont incorrectes'"
        />

        <DsfrButton type="submit" @click="onSubmit">Sauvegarder</DsfrButton>
    </form>
</template>

<script setup>
// utils
import { ref, defineProps, toRefs, computed } from "vue";
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/user.store";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";
import schema from "./FormSujets.schema";
import { setExpertiseTopics } from "@/api/users.api";

// components
import { ErrorSummary, Icon } from "@resorptionbidonvilles/ui";
import FormSujetsInputSujetsExpertise from "./inputs/FormSujetsInputSujetsExpertise.vue";
import FormSujetsInputSujetsInteret from "./inputs/FormSujetsInputSujetsInteret.vue";
import FormSujetsInputCommentaire from "./inputs/FormSujetsInputCommentaire.vue";

// data
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const error = ref(null);
const emit = defineEmits(["done"]);
const { handleSubmit, setErrors, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        expertise_topics: user.value.expertise_topics
            .filter((topic) => topic.type === "expertise")
            .map((topic) => topic.uid),
        interest_topics: user.value.expertise_topics
            .filter((topic) => topic.type === "interest")
            .map((topic) => topic.uid),
        expertise_comment: user.value.expertise_comment,
    },
});
const self = computed(() => {
    const userStore = useUserStore();
    return user.value.id === userStore.user?.id;
});

const onSubmit = handleSubmit(async (values) => {
    error.value = null;

    try {
        const accesStore = useAccesStore();
        const newValues = await setExpertiseTopics(
            user.value.id,
            values.expertise_topics,
            values.interest_topics,
            values.expertise_comment
        );

        if (self.value === true) {
            const userStore = useUserStore();
            Object.assign(userStore.user, {
                expertise_topics_chosen: newValues.expertise_topics_chosen,
                expertise_topics: newValues.expertise_topics,
                expertise_comment: newValues.expertise_comment,
            });
        } else {
            accesStore.updateUser(
                user.value.id,
                Object.assign(user.value, {
                    expertise_topics_chosen: newValues.expertise_topics_chosen,
                    expertise_topics: newValues.expertise_topics,
                    expertise_comment: newValues.expertise_comment,
                })
            );
        }

        const notificationStore = useNotificationStore();
        notificationStore.success(
            "Domaines de compétence",
            "Les domaines de compétence ont bien été modifiées"
        );

        emit("done");
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});
</script>
