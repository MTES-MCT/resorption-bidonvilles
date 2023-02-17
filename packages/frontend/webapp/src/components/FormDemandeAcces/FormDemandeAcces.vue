<template>
    <FormUtilisateur
        variant="demande-acces"
        :submit="submit"
        :requestType="requestType"
    >
        <template v-slot:subtitle
            >Voisin, citoyen, habitant d’un bidonville… Une info ? Une question
            ? Une alerte ?</template
        >
        <template v-slot:title>Contactez-nous !</template>
        <template v-slot:structureTitle>Votre structure</template>
        <template v-slot:submit>Envoyer ma demande</template>
    </FormUtilisateur>
</template>

<script setup>
import { create as createContact } from "@/api/contact.api.js";
import { trackEvent } from "@/helpers/matomo.js";
import router from "@/helpers/router.js";
import { useNotificationStore } from "@/stores/notification.store.js";
import FormUtilisateur from "@/components/FormUtilisateur/FormUtilisateur.vue";
import { ref, onMounted } from "vue";

let requestType = ref("");

onMounted(() => {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);

    if (urlParams.has("request_type")) {
        requestType.value = urlParams.get("request_type");
    }
});

async function submit(values) {
    await createContact(values);

    // tracking
    const isAccessRequest =
        values.request_type.includes("access-request") &&
        values.is_actor === true;
    if (isAccessRequest) {
        trackEvent("Demande d accès", "Demande d accès");
    } else {
        trackEvent("Contact", "Demande d information");
    }

    // notification
    const notificationStore = useNotificationStore();
    notificationStore.success(
        isAccessRequest
            ? "Votre demande d'accès a bien été envoyée"
            : "Votre message a bien été envoyé",
        "Nous la traiterons rapidement"
    );

    // forward to invitation
    let from = isAccessRequest ? "access_request" : "contact_others";
    router.push(
        `/invitation?email=${encodeURIComponent(
            values.email
        )}&first_name=${encodeURIComponent(
            values.first_name
        )}&last_name=${encodeURIComponent(values.last_name)}&from=${from}`
    );
}
</script>
