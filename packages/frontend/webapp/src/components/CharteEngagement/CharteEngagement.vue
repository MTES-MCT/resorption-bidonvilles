<template>
    <FormPublic :schema="schema" :submit="submit" size="medium">
        <template v-slot:title>Chartes d'engagement</template>
        <template v-slot:description
            ><span class="font-md text-secondary"
                >(Toutes les cases doivent être cochées)</span
            ></template
        >

        <template v-slot:body>
            <CharteEngagementInputCharteAgreement
                class="mb-6"
                v-on:input="updateInputValue"
            />
            <CharteEngagementInputConfidentialityAgreement
                class="mb-6"
                v-on:input="updateInputValue"
            />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <Button type="submit" :disabled="formValid !== 2"
                    >J'accepte et j'accède à la plateforme</Button
                >
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
import { ref } from "vue";
import router from "@/helpers/router";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import { acceptCharter } from "@/api/users.api.js";
import schema from "./CharteEngagement.schema";

import { Button } from "@resorptionbidonvilles/ui";
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import CharteEngagementInputCharteAgreement from "./inputs/CharteEngagementInputCharteAgreement.vue";
import CharteEngagementInputConfidentialityAgreement from "./inputs/CharteEngagementInputConfidentialityAgreement.vue";

const configStore = useConfigStore();
const formValid = ref(0);

const { version_charte_engagement: charte } = configStore.config;

const updateInputValue = (value) => {
    formValid.value = value.target.checked
        ? formValid.value + 1
        : formValid.value - 1;
};

async function submit({ charte_agreement, confidentiality_agreement }) {
    const notificationStore = useNotificationStore();

    await acceptCharter(
        charte.version,
        charte_agreement,
        confidentiality_agreement
    );
    configStore.config.user.charte_engagement_a_jour = true;
    notificationStore.success(
        "Bienvenue sur Résorption-bidonvilles",
        "Votre compte est désormais entièrement opérationnel"
    );
    router.push("/");
}
</script>
