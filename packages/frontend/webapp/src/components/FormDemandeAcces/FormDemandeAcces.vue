<template>
    <div class="flex flex-col items-center">
        <LanguagePicker
            v-model="language"
            :language="language"
            class="mb-4"
            v-if="!demandeAccesOnly"
        />

        <FormUtilisateur
            variant="demande-acces"
            :submit="submit"
            :language="language"
        >
            <template v-slot:subtitle>{{
                translations[language].subtitle
            }}</template>
            <template v-slot:title>{{ translations[language].title }}</template>
            <template v-slot:structureTitle>{{
                translations[language].structure
            }}</template>
            <template v-slot:submit>{{
                translations[language].submit
            }}</template>
        </FormUtilisateur>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { requestCreation } from "@/api/contact.api.js";
import { trackEvent } from "@/helpers/matomo.js";
import router from "@/helpers/router.js";
import { useNotificationStore } from "@/stores/notification.store.js";
import translations from "./FormDemandeAcces.translations";

import FormUtilisateur from "@/components/FormUtilisateur/FormUtilisateur.vue";
import { LanguagePicker } from "@resorptionbidonvilles/ui";

const route = useRoute();

const language = ref(route.query.language || "fr");
const demandeAccesOnly = computed(() => {
    const { acces } = router.currentRoute.value.query;
    return acces !== undefined;
});

async function submit(values) {
    console.log("values:");
    console.log(values);

    await requestCreation(values);

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
            ? translations[language.value].notification_title_access_request
            : translations[language.value].notification_title_contact_others,
        isAccessRequest
            ? translations[language.value]
                  .notification_description_access_request
            : translations[language.value]
                  .notification_description_contact_others
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
