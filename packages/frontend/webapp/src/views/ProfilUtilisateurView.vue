<template>
    <LayoutLoading v-if="isLoading !== false"></LayoutLoading>

    <LayoutError v-else-if="error !== null" :variant="errorType">
        <template v-slot:title>Fiche utilisateur inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter la fiche d'un utilisateur, mais nous ne
            parvenons pas à collecter les informations nécessaires. Vous pouvez
            réessayer un peu plus tard ou nous contacter en cas
            d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                v-if="allowReload"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <Layout v-else>
        <ProfilUtilisateur
            :user="user"
            :buildTabRoute="(tabId) => `/utilisateur/${userId}/${tabId}`"
        >
            <template v-slot:title>Compte utilisateur</template>
            <template v-slot:description
                >Mettez à jour les informations liées à ce compte</template
            >
        </ProfilUtilisateur>
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useAccesStore } from "@/stores/acces.store.js";
import { useUserStore } from "@/stores/user.store";
import router, { setDocumentTitle } from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import ProfilUtilisateur from "@/components/ProfilUtilisateur/ProfilUtilisateur.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const accesStore = useAccesStore();
const isLoading = ref(null);
const error = ref(null);
let userRef = null;
const user = computed(() =>
    userRef !== null && userRef.value !== null ? userRef.value : null
);
const allowReload = ref(true);
const errorType = ref("erreur");

onMounted(load);

const userId = computed(() => {
    return router.currentRoute.value.params.id;
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    const userStore = useUserStore();
    if (parseInt(userId.value, 10) === userStore.user?.id) {
        router.replace(`/mon-compte/${router.currentRoute.value.params.tab}`);
        return;
    }

    if (!userStore.user?.is_superuser) {
        error.value = "Permission d'accés refusée";
        isLoading.value = false;
        allowReload.value = false;
        errorType.value = "interdit";
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        userRef = await accesStore.fetchUser(userId.value);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${userRef.value.last_name} ${userRef.value.first_name}`
        );
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
