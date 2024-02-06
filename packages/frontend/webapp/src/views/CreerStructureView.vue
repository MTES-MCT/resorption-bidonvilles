<template>
    <LayoutForm size="large">
        <template v-slot:title>Créer une nouvelle structure</template>
        <template v-slot:buttons>
            <Button variant="primaryOutline" type="button" @click="back"
                >Annuler</Button
            >
            <Button @click="submit" :loading="form?.isSubmitting"
                >Créer la structure</Button
            >
        </template>

        <ContentWrapper size="large">
            <FormCreerStructure ref="form" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { ref } from "vue";
import router from "@/helpers/router";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormCreerStructure from "@/components/FormCreerStructure/FormCreerStructure.vue";

const form = ref(null);

function back() {
    router.back();
}

function submit(...args) {
    form.value.submit(...args);
}
</script>
