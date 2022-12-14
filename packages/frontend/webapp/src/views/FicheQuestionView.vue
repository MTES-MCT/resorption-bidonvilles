<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Fiche action inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter la fiche détaillée d'une question, mais
            nous ne parvenons pas à collecter les informations nécessaires. Vous
            pouvez réessayer un peu plus tard ou nous contacter en cas
            d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <Layout :paddingBottom="false" v-else>
        <FicheQuestion :question="question" />
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useCommunauteStore } from "@/stores/communaute.store.js";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import FicheQuestion from "@/components/FicheQuestion/FicheQuestion.vue";

const communauteStore = useCommunauteStore();
const isLoading = ref(null);
const error = ref(null);
const question = ref(null);

const questionId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

onMounted(load);
watch(questionId, load);

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;

    try {
        question.value = await communauteStore.fetchQuestion(questionId.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
