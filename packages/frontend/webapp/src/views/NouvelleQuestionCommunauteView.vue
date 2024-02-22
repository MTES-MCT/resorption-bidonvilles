<template>
    <LayoutForm size="large">
        <template v-slot:title>Poser une question à la communauté</template>

        <template v-slot:buttons>
            <Button variant="primaryOutline" type="button" @click="back"
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
