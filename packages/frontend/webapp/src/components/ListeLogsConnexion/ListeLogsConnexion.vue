<template>
    <ContentWrapper>
        <ListeLogsConnexionHeader />

        <Loading class="py-28" v-if="isLoading !== false" />

        <ViewError v-else-if="error">
            <template v-slot:title>Échec de la collecte des données</template>
            <template v-slot:code>{{ error }}</template>
            <template v-slot:content>
                Une erreur est survenue lors de la collecte des logs de
                connexion. Vous pouvez réessayer un peu plus tard ou nous
                contacter.
            </template>
            <template v-slot:actions>
                <Button
                    icon="rotate-right"
                    iconPosition="left"
                    type="button"
                    @click="load"
                >
                    Réessayer
                </Button>
                <ButtonContact />
            </template>
        </ViewError>

        <div v-else>
            <ListeLogsConnexionFiltres />
            <ListeLogsConnexionTableau
                class="mt-6"
                v-if="logsStore.total > 0"
            />
            <ListeLogsConnexionVide class="mt-12" v-else />
        </div>
    </ContentWrapper>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSigninLogsStore } from "@/stores/signinLogs.store";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import Loading from "@/components/Loading/Loading.vue";
import ListeLogsConnexionHeader from "./ListeLogsConnexionHeader.vue";
import ListeLogsConnexionFiltres from "./ListeLogsConnexionFiltres.vue";
import ListeLogsConnexionTableau from "./ListeLogsConnexionTableau.vue";
import ListeLogsConnexionVide from "./ListeLogsConnexionVide.vue";
import ViewError from "@/components/ViewError/ViewError.vue";

const logsStore = useSigninLogsStore();
const isLoading = ref(null);
const error = ref(null);

onMounted(load);

async function load() {
    if (logsStore.loaded) {
        isLoading.value = false;
        return;
    }

    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        await logsStore.fetchList();
        logsStore.currentPage.index = 1;
    } catch (e) {
        error.value = e?.code || e?.user_message || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
