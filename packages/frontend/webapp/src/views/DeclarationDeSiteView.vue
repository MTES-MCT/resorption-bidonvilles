<template>
    <LayoutForm size="large">
        <template v-slot:title>Déclarer un nouveau site</template>
        <template v-slot:buttons>
            <Button
                variant="primaryOutline"
                type="button"
                @click="back"
                class="hover:!bg-primary !border-2 !border-primary"
                >Annuler</Button
            >
            <Button @click="submit" :loading="form?.isSubmitting"
                >Déclarer le site</Button
            >
        </template>

        <ContentWrapper size="large">
            <FormDeclarationDeSite ref="form" mode="create" />
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

<style scoped>
button {
    border: inherit;
}
</style>
