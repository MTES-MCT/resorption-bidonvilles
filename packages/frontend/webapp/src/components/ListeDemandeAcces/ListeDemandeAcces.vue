<template>
    <ContentWrapper>
        <ListeDemandeAccesHeader />

        <Loading class="py-28" v-if="isLoading !== false" />

        <ViewError v-else-if="error">
            <template v-slot:title>Échec de la collecte des données</template>
            <template v-slot:code>{{ error }}</template>
            <template v-slot:content
                >Une erreur est survenue lors de la collecte des demandes
                d'accès sur votre territoire. Vous pouvez réessayer un peu plus
                tard ou nous contacter.</template
            >
            <template v-slot:actions>
                <Button
                    icon="rotate-right"
                    iconPosition="left"
                    type="button"
                    @click="load"
                    >Réessayer</Button
                >
                <ButtonContact />
            </template>
        </ViewError>

        <div v-else>
            <ListeDemandeAccesFiltres />
            <ListeDemandeAccesTableau
                class="mt-6"
                v-if="accesStore.total > 0"
            />
            <ListeDemandeAccesVide class="mt-12" v-else />
        </div>
    </ContentWrapper>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAccesStore } from "@/stores/acces.store";

import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";
import ListeDemandeAccesHeader from "./ListeDemandeAccesHeader.vue";
import ListeDemandeAccesFiltres from "./ListeDemandeAccesFiltres.vue";
import ListeDemandeAccesTableau from "./ListeDemandeAccesTableau.vue";
import ListeDemandeAccesVide from "./ListeDemandeAccesVide.vue";
import ViewError from "@/components/ViewError/ViewError.vue";

const accesStore = useAccesStore();
const isLoading = ref(null);
const error = ref(null);

onMounted(load);
async function load() {
    if (accesStore.loaded) {
        isLoading.value = false;
        return;
    }

    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        await accesStore.fetchList();
        accesStore.currentPage.index = 1;
    } catch (e) {
        error.value = e?.code || e?.user_message || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
