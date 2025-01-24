<template>
    <LayoutForm size="large">
        <template v-slot:icon
            ><img :src="svgSiteAdd" alt="Signaler un site"
        /></template>
        <template v-slot:title>Informer d'un nouveau site</template>
        <template v-slot:buttons>
            <Button
                variant="primaryOutline"
                type="button"
                @click="back"
                class="hover:!bg-primary !border-2 !border-primary"
                >Annuler</Button
            >
            <Button @click="submit" :loading="form?.isSubmitting"
                >Envoyer l'information aux administrateurs</Button
            >
        </template>

        <ContentWrapper size="large">
            <FormDeclarationDeSite ref="form" mode="report" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { ref } from "vue";
import router from "@/helpers/router";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormDeclarationDeSite from "@/components/FormDeclarationDeSite/FormDeclarationDeSite.vue";

import svgSiteAdd from "@/assets/img/dsfr/site-add.svg";

const form = ref(null);

function back() {
    router.back();
}

function submit(...args) {
    form.value.submit(...args);
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
