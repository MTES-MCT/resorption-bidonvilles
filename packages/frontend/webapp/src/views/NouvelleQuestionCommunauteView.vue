<template>
    <LayoutForm size="large">
        <template v-slot:icon
            ><img :src="svgCommunity" alt="Poser une question"
        /></template>
        <template v-slot:title>Poser une question à la communauté</template>
        <template v-slot:subtitle>
            J'ai besoin de l'aide de la communauté.
        </template>
        <template v-slot:buttons>
            <Button
                variant="primaryOutline"
                type="button"
                @click="back"
                class="!border-2 !border-primary hover:!bg-primary"
                >Annuler</Button
            >
            <Button @click="submit" :loading="form?.isSubmitting"
                >Publier</Button
            >
        </template>

        <ContentWrapper size="large">
            <FormNouvelleQuestion :resume="resume" ref="form" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { ref, computed } from "vue";
import router from "@/helpers/router";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormNouvelleQuestion from "@/components/FormNouvelleQuestion/FormNouvelleQuestion.vue";

import svgCommunity from "@/assets/img/dsfr/community.svg";

const form = ref(null);

const resume = computed(() => {
    return router.currentRoute.value.query.resume;
});

function submit(...args) {
    return form.value.submit(...args);
}

function back() {
    router.back();
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
