<template>
    <TextArea
        :rows="5"
        id="answer"
        :label="labels.answer"
        placeholder="Saisissez ici votre réponse"
        ref="textarea"
    />
</template>

<script setup>
import { onMounted, ref } from "vue";
import router from "@/helpers/router";

import labels from "../FicheQuestionNouvelleReponse.labels";
import { TextArea } from "@resorptionbidonvilles/ui";

const textarea = ref(null);
onMounted(() => {
    if (router.currentRoute.value.hash === "#reponses") {
        textarea.value.focus();
    }
});
</script>
