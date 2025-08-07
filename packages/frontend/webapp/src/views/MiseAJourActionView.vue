<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Formulaire inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez compléter les informations d'une action, mais nous
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
        <template v-slot:icon
            ><img :src="svgSearch" alt="Mise à jour de l'action"
        /></template>
        <template v-slot:title>Mise à jour de l'action</template>
        <template v-slot:subtitle>
            {{ action.name }}
        </template>
        <template v-slot:buttons>
            <DsfrButton secondary @click.prevent.stop="back"
                >Annuler</DsfrButton
            >
            <DsfrButton @click="submit" :loading="form?.isSubmitting"
                >Mettre à jour l'action</DsfrButton
            >
        </template>

        <ContentWrapper size="large">
            <FormDeclarationAction ref="form" :action="action" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useActionsStore } from "@/stores/actions.store.js";
import router, { setDocumentTitle } from "@/helpers/router";
import backOrReplace from "@/utils/backOrReplace";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormDeclarationAction from "@/components/FormDeclarationAction/FormDeclarationAction.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

import svgSearch from "@/assets/img/dsfr/search.svg";

const actionsStore = useActionsStore();
const isLoading = ref(null);
const error = ref(null);
const action = ref(null);
const form = ref(null);

onMounted(load);

const actionId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        action.value = (await actionsStore.fetchAction(actionId.value)).value;
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${action.value.name}`
        );
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}

function submit(...args) {
    return form.value.submit(...args);
}

function back() {
    if (actionId.value) {
        backOrReplace(`/action/${actionId.value}`);
    } else {
        router.back();
    }
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
