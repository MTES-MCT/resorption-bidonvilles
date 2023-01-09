<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Formulaire inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez compléter les indicateurs d'une action, mais nous
            ne parvenons pas à collecter les informations nécessaires. Vous
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

    <LayoutForm v-else size="large">
        <template v-slot:title>Mettre à jour des indicateurs </template>
        <template v-slot:subtitle>
            {{ plan.name }}
        </template>
        <template v-slot:buttons>
            <Button variant="primaryOutline" type="button" @click="back"
                >Annuler</Button
            >
            <Button @click="submit">Mettre à jour les indicateurs</Button>
        </template>

        <ContentWrapper size="large">
            <FormMiseAJourIndicateurs ref="form" :plan="plan" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { usePlansStore } from "@/stores/plans.store.js";
import router from "@/helpers/router";
import backOrReplace from "@/utils/backOrReplace";

import { Button } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormMiseAJourIndicateurs from "@/components/FormMiseAJourIndicateurs/FormMiseAJourIndicateurs.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const plansStore = usePlansStore();
const isLoading = ref(null);
const error = ref(null);
const plan = ref(null);
const form = ref(null);

onMounted(load);

const planId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        plan.value = await plansStore.fetchPlan(planId.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}

function submit(...args) {
    return form.value.submit(...args);
}

function back() {
    if (planId.value) {
        backOrReplace(`/action/${planId.value}`);
    } else {
        router.back();
    }
}
</script>
