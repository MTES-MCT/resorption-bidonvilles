<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
            <ViewHeader icon="user-plus">
                <template v-slot:title>Ajouter un utilisateur</template>
                <template v-slot:description
                    >Remplissez le formulaire suivant pour ajouter un nouvel
                    utilisateur, puis envoyez lui un accès</template
                >
            </ViewHeader>
        </ContentWrapper>
        <FormCreerUtilisateur />
    </Layout>
</template>

<script setup>
import { FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FormCreerUtilisateur from "@/components/FormCreerUtilisateur/FormCreerUtilisateur.vue";

const ariane = [
    { label: "Accueil", to: "/" },
    { label: "Administration", to: "/acces" },
    { label: "Ajouter un utilisateur" },
];
</script>
