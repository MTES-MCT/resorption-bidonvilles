<template>
    <form>
        <FormSujetsInputSujets />

        <ErrorSummary
            v-if="error || Object.keys(errors).length > 0"
            :message="error || 'Certaines données sont incorrectes'"
        />

        <Button type="submit" @click="onSubmit">Sauvegarder</Button>
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
import { selectTags } from "@/api/users.api";

// components
import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormSujetsInputSujets from "./inputs/FormSujetsInputSujets.vue";

// data
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const error = ref(null);
const { handleSubmit, setErrors, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        tags: user.value.tags.map((tag) => tag.uid),
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
        const newValues = await selectTags(user.value.id, values.tags);

        if (self.value === true) {
            const userStore = useUserStore();
            Object.assign(userStore.user, {
                tags_chosen: newValues.tags_chosen,
                tags: newValues.tags,
            });
        } else {
            accesStore.updateUser(
                user.value.id,
                Object.assign(user.value, {
                    tags_chosen: newValues.tags_chosen,
                    tags: newValues.tags,
                })
            );
        }

        const notificationStore = useNotificationStore();
        notificationStore.success(
            "Sujets d'intérêts",
            "Les sujets d'intérêts ont bien été modifiées"
        );
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});
</script>
