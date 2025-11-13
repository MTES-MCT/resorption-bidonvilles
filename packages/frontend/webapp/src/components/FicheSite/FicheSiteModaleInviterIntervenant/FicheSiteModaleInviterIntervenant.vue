<template>
    <Modal @close="onClose" ref="modale">
        <template v-slot:title>Inviter un intervenant</template>
        <template v-slot:subtitle>
            <FicheSiteModaleSubtitle :town="town" />
        </template>
        <template v-slot:body>
            <ModaleInviterIntervenantInputUser :townId="town.id" />
            <ModaleInviterIntervenantInputEmail />

            <ErrorSummary
                class="mt-4"
                v-if="error || Object.keys(errors).length > 0"
                :message="error"
                :summary="errors"
            />
        </template>

        <template v-slot:footer>
            <div class="flex justify-end gap-2">
                <DsfrButton secondary @click="() => modale.close()"
                    >Annuler</DsfrButton
                >
                <DsfrButton @click="submit" :disabled="isSubmitting"
                    >Inviter</DsfrButton
                >
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { useForm } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import schema from "./FicheSiteModaleInviterIntervenant.schema";

import { ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import FicheSiteModaleSubtitle from "../FicheSiteModaleSubtitle/FicheSiteModaleSubtitle.vue";
import ModaleInviterIntervenantInputEmail from "./inputs/ModaleInviterIntervenantInputEmail.vue";
import ModaleInviterIntervenantInputUser from "./inputs/ModaleInviterIntervenantInputUser.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const modale = ref(null);

const { handleSubmit, isSubmitting, setErrors, errors, resetForm, values } =
    useForm({
        validationSchema: schema,
    });
const error = ref(null);
const mode = computed(() => {
    if (values.user?.data?.id !== undefined) {
        return "inviteExisting";
    }

    return "inviteNew";
});

const config = {
    inviteExisting: {
        async submit(values) {
            const townsStore = useTownsStore();
            await townsStore.addActor(town.value.id, values.user.data.id);

            trackEvent(
                "Intervenant",
                "Invitation intervenant",
                `S${town.value.id}`
            );
        },
        successWording: "L'intervenant a bien été notifié par courriel",
    },
    inviteNew: {
        async submit(values) {
            const townsStore = useTownsStore();
            await townsStore.inviteActor(town.value.id, values.email);

            trackEvent(
                "Intervenant",
                "Invitation intervenant",
                `S${town.value.id}`
            );
        },
        successWording: "L'invitation a bien été envoyée",
    },
};

function onClose() {
    resetForm();
}

const submit = handleSubmit(async (values) => {
    const { submit, successWording } = config[mode.value];
    const notificationStore = useNotificationStore();
    error.value = null;

    try {
        await submit(values);
        notificationStore.success("Inviter un intervenant", successWording);
        modale.value.close();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});
</script>
