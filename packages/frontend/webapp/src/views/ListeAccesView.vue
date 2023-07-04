<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <ListeDemandeAcces />
    </Layout>
</template>

<script setup>
import { FilArianne } from "@resorptionbidonvilles/ui";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Layout from "@/components/Layout/Layout.vue";
import ListeDemandeAcces from "@/components/ListeDemandeAcces/ListeDemandeAcces.vue";

const ariane = [{ label: "Accueil", to: "/" }, { label: "Administration" }];
</script>
