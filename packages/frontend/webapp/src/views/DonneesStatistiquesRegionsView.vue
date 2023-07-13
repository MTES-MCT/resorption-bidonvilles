<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" />
        </ContentWrapper>
        <DonneesStatistiques />
    </Layout>
</template>

<script setup>
import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import DonneesStatistiques from "@/components/DonneesStatistiques/DonneesStatistiques.vue";

const ariane = [
    { label: "Visualisation des données" },
    { label: "Départements" },
];
</script>
