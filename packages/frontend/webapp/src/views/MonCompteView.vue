<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <ProfilUtilisateur
            :user="userStore.user"
            :buildTabRoute="(tabId) => `/mon-compte/${tabId}`"
        >
            <template v-slot:title>Mon compte</template>
            <template v-slot:description
                >Mettez à jour les informations liées à votre compte</template
            >
        </ProfilUtilisateur>
    </Layout>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store.js";

import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import ProfilUtilisateur from "@/components/ProfilUtilisateur/ProfilUtilisateur.vue";

const ariane = [{ label: "Accueil", to: "/" }, { label: "Mon compte" }];
const userStore = useUserStore();
</script>
