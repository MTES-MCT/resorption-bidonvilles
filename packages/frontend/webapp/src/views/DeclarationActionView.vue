<template>
    <LayoutForm size="large">
        <template v-slot:title>Déclaration d'une action</template>
        <template v-slot:buttons>
            <Button variant="primaryOutline" type="button" @click="back"
                >Annuler</Button
            >
            <Button @click="submit">Déclarer l'action</Button>
        </template>

        <ContentWrapper size="large">
            <FormDeclarationAction ref="form" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { ref } from "vue";
import router from "@/helpers/router";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormDeclarationAction from "@/components/FormDeclarationAction/FormDeclarationAction.vue";

const form = ref(null);

function back() {
    router.back();
}

function submit(...args) {
    form.value.submit(...args);
}
</script>
