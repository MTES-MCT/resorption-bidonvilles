<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
            <PlanDuSite />
        </ContentWrapper>
    </Layout>
</template>
<script setup>
import Layout from "@/components/Layout/Layout.vue";
import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import PlanDuSite from "@/components/PlanDuSite/PlanDuSite.vue";

const ariane = [{ label: "Accueil", to: "/" }, { label: "Plan du site" }];
</script>
