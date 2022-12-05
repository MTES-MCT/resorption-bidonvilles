<template>
    <Layout>
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

import Layout from "@/components/Layout/Layout.vue";
import ProfilUtilisateur from "@/components/ProfilUtilisateur/ProfilUtilisateur.vue";

const userStore = useUserStore();
</script>
