<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <ListeLogsConnexion
            v-if="userStore.user?.role_id === 'national_admin'"
        />
        <ContentWrapper v-else>
            <ViewError>
                <template v-slot:title>Accès non autorisé</template>
                <template v-slot:content>
                    Vous n'avez pas les permissions nécessaires pour accéder aux
                    logs de connexion.
                </template>
            </ViewError>
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import ListeLogsConnexion from "@/components/ListeLogsConnexion/ListeLogsConnexion.vue";
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();

const ariane = [
    { label: "Accueil", to: "/" },
    { label: "Administration" },
    { label: "Logs de connexion" },
];
</script>
