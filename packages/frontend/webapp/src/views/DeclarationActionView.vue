<template>
    <LayoutForm size="large">
        <template v-slot:icon
            ><img :src="svgAction" alt="Déclarer une nouvelle action"
        /></template>
        <template v-slot:title>Déclaration d'une action</template>
        <template v-slot:subtitle> Je souhaite renseigner une action.</template>
        <template v-slot:buttons>
            <Button
                variant="primaryOutline"
                type="button"
                @click="back"
                class="!border-2 !border-primary hover:!bg-primary"
                >Annuler</Button
            >
            <Button @click="submit" :loading="form?.isSubmitting"
                >Déclarer l'action</Button
            >
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

import svgAction from "@/assets/img/dsfr/human-cooperation.svg";

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
