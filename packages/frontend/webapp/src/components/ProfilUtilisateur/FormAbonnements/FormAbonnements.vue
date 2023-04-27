<template>
    <form>
        <FormAbonnementsInputAbonnements />
        <ErrorSummary
            v-if="error || Object.keys(errors).length > 0"
            :message="error"
            :summary="errors"
        />
        <Button type="submit" @click="onSubmit">Sauvegarder</Button>
    </form>
</template>

<script setup>
// utils
import { ref, toRefs, computed, onMounted } from "vue";
import { useForm, useFieldValue } from "vee-validate";
import { useUserStore } from "@/stores/user.store.js";
import { useNotificationStore } from "@/stores/notification.store.js";
import schema from "./FormAbonnements.schema";
import { edit as editSelf } from "@/api/me.api";
import { edit } from "@/api/users.api";
import subscriptions from "@/utils/email_subscriptions";

// components
import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormAbonnementsInputAbonnements from "./inputs/FormAbonnementsInputAbonnements.vue";
import router from "@/helpers/router";

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
        email_subscriptions: user.value.email_subscriptions,
    },
});
const self = computed(() => {
    const userStore = useUserStore();
    return user.value.id === userStore.user?.id;
});
const emailSubscriptionValue = useFieldValue("email_subscriptions");

const onSubmit = handleSubmit(async (updatedValues) => {
    error.value = null;

    try {
        if (self.value === true) {
            const newValues = await editSelf(updatedValues);
            const userStore = useUserStore();
            Object.assign(userStore.user, newValues);
        } else {
            await edit(user.value.id, updatedValues);
        }

        const notificationStore = useNotificationStore();
        notificationStore.success(
            "Abonnements",
            "La liste des abonnements aux courriels automatiques a bien été modifiée"
        );
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

onMounted(async () => {
    const allowedSubscriptions = Object.keys(subscriptions);
    const { abonnements, desabonnements } = router.currentRoute.value.query;
    let subscriptionsChanged = false;

    // on abonne l'utilisateur automatiquement
    if (abonnements) {
        abonnements.split(",").forEach((abonnement) => {
            if (
                allowedSubscriptions.includes(abonnement) &&
                !user.value.email_subscriptions.includes(abonnement)
            ) {
                emailSubscriptionValue.value.push(abonnement);
                subscriptionsChanged = true;
            }
        });
    }

    // on désabonne l'utilisateur automatiquement
    if (desabonnements) {
        desabonnements.split(",").forEach((abonnement) => {
            const index = user.value.email_subscriptions.indexOf(abonnement);
            if (allowedSubscriptions.includes(abonnement) && index >= 0) {
                emailSubscriptionValue.value.splice(index, 1);
                subscriptionsChanged = true;
            }
        });
    }

    if (subscriptionsChanged === true) {
        await onSubmit();
        router.replace("/mon-compte/abonnements");
    }
});
</script>
