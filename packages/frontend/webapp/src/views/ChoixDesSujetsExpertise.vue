<template>
    <Layout>
        <ContentWrapper>
            <h2 class="text-xl font-bold text-red">Nouveau !</h2>
            <h2 class="text-xl font-bold">
                Quels sont vos sujets d'intérêt ou d'expertise ?
            </h2>
        </ContentWrapper>

        <ContentWrapper class="mt-10">
            <FormSujets :user="userStore.user" />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store";
import Layout from "@/components/Layout/Layout.vue";
import FormSujets from "@/components/ProfilUtilisateur/FormSujets/FormSujets.vue";
import { ContentWrapper } from "@resorptionbidonvilles/ui";

const userStore = useUserStore();
</script>
