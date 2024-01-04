<template>
    <Layout>
        <ContentWrapper>
            <h2 class="text-xl font-bold text-red">Nouveau !</h2>
            <h2 class="text-xl font-bold">
                Quels sont vos domaines de compétence ou sujets d'intérêt ?
            </h2>
        </ContentWrapper>

        <ContentWrapper class="mt-10">
            <FormSujets :user="userStore.user" @done="redirectToEntrypoint" />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";

import Layout from "@/components/Layout/Layout.vue";
import FormSujets from "@/components/ProfilUtilisateur/FormSujets/FormSujets.vue";
import { ContentWrapper } from "@resorptionbidonvilles/ui";

const userStore = useUserStore();
function redirectToEntrypoint() {
    router.replace("/");
}
</script>
