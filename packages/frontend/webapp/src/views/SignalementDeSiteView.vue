<template>
    <LayoutForm size="large">
        <template v-slot:title>Informer d'un nouveau site</template>
        <template v-slot:buttons>
            <Button variant="primaryOutline" type="button" @click="back"
                >Annuler</Button
            >
            <Button @click="submit">Envoyer l'information</Button>
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

const form = ref(null);

function back() {
    router.back();
}

function submit(...args) {
    form.value.submit(...args);
}
</script>
