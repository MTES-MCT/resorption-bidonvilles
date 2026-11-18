<template>
    <Layout>
        <div class="fr-container fr-mt-2w fr-mb-6w">
            <FilArianne :items="ariane" class="fr-mb-4w" />
            <div class="fr-grid-row">
                <div class="fr-col-12 fr-col-lg-10">
                    <ConditionsUtilisation />
                </div>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout/Layout.vue";
import { FilArianne } from "@resorptionbidonvilles/ui";
import ConditionsUtilisation from "@/components/ConditionsUtilisation/ConditionsUtilisation.vue";

const ariane = [
    { label: "Accueil", to: "/" },
    { label: "Conditions générales d'utilisation" },
];
</script>
