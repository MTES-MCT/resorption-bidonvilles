<template>
    <div class="flex flex-col items-center">
        <LanguagePicker
            v-model="language"
            :language="language"
            class="mb-4"
            v-if="!demandeAccesOnly"
        />

        <FormUtilisateur
            :variant="demandeAccesOnly ? 'demande-acces' : 'demande-contact'"
            :submit="submit"
            :language="language"
        >
            <template v-slot:title>{{ formTitle }}</template>
            <template v-slot:alert>{{ translations[language].alert }}</template>
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
import { ref, computed, onMounted, watch } from "vue";
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

const formTitle = computed(() => {
    return !demandeAccesOnly.value && language.value === "fr"
        ? translations[language.value].title_contact_request
        : translations[language.value].title;
});

async function submit(values) {
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
const changePageTitle = () => {
    document.title =
        !demandeAccesOnly.value && language.value === "fr"
            ? "Contacter l'équipe"
            : "Demander un accès";
};

watch(demandeAccesOnly, () => {
    changePageTitle();
});

onMounted(() => {
    changePageTitle();
});
</script>
