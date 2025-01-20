<template>
    <Modal closeWhenClickOutside ref="modale">
        <template v-slot:title
            >Confirmez-vous la demande d'information ?</template
        >
        <template v-slot:body>
            <div class="mt-6">
                <p class="mb-2">
                    Vous êtes sur le point de demander les coordonnées du
                    propriétaire de la parcelle cadastrale
                    <span class="font-bold text-primary">{{ parcelle }}</span
                    >.
                </p>
                <p class="mb-2">
                    Si le site est localisé sur plusieurs parcelles, il convient
                    de modifier manuellement le point de localisation et
                    procéder à une nouvelle demande pour chaque parcelle.
                </p>
                <p>Ces demandes sont tracées.</p>
            </div>
            <ErrorSummary
                v-if="error"
                :message="error"
                :summary="errorSummary"
                class="mb-0 mt-6"
            />
        </template>

        <template v-slot:footer>
            <Button variant="primaryText" @click="() => modale.close()"
                >Annuler</Button
            >
            <Button
                class="ml-5"
                :loading="loading"
                @click="alert('Vous avez cliqué !')"
            >
                Confirmer</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { ref, toRefs } from "vue";
// import { useNotificationStore } from "@/stores/notification.store";
// import { useQuestionsStore } from "@/stores/questions.store";
// import { useUserStore } from "@/stores/user.store";

import { Modal, Button, ErrorSummary } from "@resorptionbidonvilles/ui";

const props = defineProps({
    parcelle: {
        type: String,
        required: true,
    },
});
const { parcelle } = toRefs(props);

const modale = ref(null);

const loading = ref(false);
const error = ref(null);
const errorSummary = ref({});

// async function connaitreProprietaire() {
//     if (loading.value === true) {
//         return;
//     }

//     loading.value = true;
//     error.value = null;
//     errorSummary.value = {};
//     try {
//         const notificationStore = useNotificationStore();
//         const questionStore = useQuestionsStore();
//         await questionStore.deleteAnswer(
//             questionId.value,
//             answer.value.id,
//             reason.value
//         );

//         notificationStore.success(
//             "Message supprimé",
//             !isOwner.value
//                 ? "L'auteur du message en a été notifié par mail"
//                 : "Votre message a bien été supprimé"
//         );
//         modale.value.close();
//     } catch (e) {
//         error.value = e?.user_message || "Une erreur inconnue est survenue";
//         if (e?.fields && Object.keys(e.fields).length > 0) {
//             errorSummary.value = Object.keys(e.fields).reduce(
//                 (acc, key) => ({
//                     ...acc,
//                     [key]: e.fields[key][0],
//                 }),
//                 {}
//             );
//         }
//     }

//     loading.value = false;
// }
</script>
