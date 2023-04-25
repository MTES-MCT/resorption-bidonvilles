<template>
    <LayoutForm size="large">
        <template v-slot:title>Déclaration d'un site</template>
        <template v-slot:buttons>
            <Button variant="primaryOutline" type="button" @click="back"
                >Annuler</Button
            >
            <Button @click="submit">Déclarer le site</Button>
        </template>

        <ContentWrapper size="large">
            <FormDeclarationDeSite ref="form" mode="create" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { ref } from "vue";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FormDeclarationDeSite from "@/components/FormDeclarationDeSite/FormDeclarationDeSite.vue";

const form = ref(null);

function back() {
    router.back();
}

function submit(...args) {
    form.value.submit(...args);
}
</script>
