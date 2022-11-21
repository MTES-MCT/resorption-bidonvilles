<template>
    <div class="object-center">
        <slot />
        <div class="object-center max-w-3xl mx-8 lg:mx-auto">
            <div class="bg-yellow-200 flex flex-row p-5 mb-8">
                <div>
                    <Checkbox
                        :value="true"
                        variant="checkbox"
                        v-model="charte_agreement"
                        :disabled="form.status === 'pending'"
                    />
                </div>
                <div>
                    En validant mon accès à
                    <span class="italic">Résorption-bidonvilles</span>,
                    <strong
                        >je m’engage à contribuer et à utiliser la plateforme
                        dans une optique de résorption des bidonvilles selon
                        l'approche humaine et pragmatique décrite par
                        <a
                            class="link"
                            href="https://www.legifrance.gouv.fr/download/pdf/circ?id=42949"
                            target="_blank"
                        >
                            l'instruction du 25 janvier 2018
                        </a>
                    </strong>
                    .
                </div>
            </div>

            <div class="bg-yellow-200 flex flex-row p-5 mb-8">
                <div>
                    <Checkbox
                        :value="true"
                        variant="checkbox"
                        v-model="confidentiality_agreement"
                        :disabled="form.status === 'pending'"
                    />
                </div>
                <div>
                    <p>
                        Je m'engage à
                        <strong>
                            respecter la charte d'engagement, à exploiter les
                            informations présentes sur la plateforme
                            exclusivement pour les besoins propres de mon
                            organisation ; à ne pas communiquer
                        </strong>
                        sous aucune forme (orale, écrite, copie) à un tiers.
                    </p>

                    <p class="mt-4 font-bold">
                        <a class="link" :href="charte.fichier" target="_blank">
                            Consulter la charte d'engagement
                        </a>
                    </p>
                </div>
            </div>

            <div class="flex justify-between">
                <Button
                    class="mb-4 flex flex-none"
                    variant="primaryText"
                    @click="cancel"
                >
                    Annuler
                </Button>
                <Button
                    type="primary"
                    variant="tertiary"
                    class="mb-4"
                    :loading="loading"
                    :disabled="
                        form.status === 'pending' ||
                        !charte_agreement.includes(true) ||
                        !confidentiality_agreement.includes(true)
                    "
                    @click="submit"
                    >Oui, je valide la charte
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/helpers/router";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";

import { acceptCharte } from "@/api/users.api.js";
import { Checkbox, Button } from "@resorptionbidonvilles/ui";

const configStore = useConfigStore();
const notificationStore = useNotificationStore();

const {
    user: { id: userId },
    version_charte_engagement: charte,
} = configStore.config;

const charte_agreement = ref([]);
const confidentiality_agreement = ref([]);
const loading = ref(false);
const form = ref({
    status: null,
});

function cancel() {
    router.push("/deconnexion");
}

async function submit() {
    try {
        if (form.value.status === "pending") {
            return;
        }

        loading.value = true;
        form.value.status = "pending";

        await acceptCharte(
            userId,
            charte.version,
            charte_agreement.value[0],
            confidentiality_agreement.value[0]
        );
        configStore.config.user.charte_engagement_a_jour = true;
        loading.value = false;
        router.push("/");
    } catch ({ user_message: message }) {
        loading.value = false;
        notificationStore.error(
            "Validation de la charte d'engagement",
            message || "Une erreur inconnue est survenue"
        );
        form.value.status = "error";
    }
}
</script>
