<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Formulaire inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez compléter les informations d'un site, mais nous ne
            parvenons pas à collecter les informations nécessaires. Vous pouvez
            réessayer un peu plus tard ou nous contacter en cas
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
            ><img :src="svgUpdate" alt="Mise à jour"
        /></template>
        <template v-slot:title>Mise à jour du site</template>
        <template v-slot:subtitle>
            {{ town.addressSimple
            }}<template v-if="town.name"> « {{ town.name }} »</template>
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
                >Mettre à jour le site</Button
            >
        </template>

        <ContentWrapper size="large">
            <FormDeclarationDeSite ref="form" :town="town" mode="edit" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useTownsStore } from "@/stores/towns.store.js";
import router, { setDocumentTitle } from "@/helpers/router";
import backOrReplace from "@/utils/backOrReplace";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormDeclarationDeSite from "@/components/FormDeclarationDeSite/FormDeclarationDeSite.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

import svgUpdate from "@/assets/img/dsfr/update.svg";

const townsStore = useTownsStore();
const isLoading = ref(null);
const error = ref(null);
const form = ref(null);

onMounted(load);

const townId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});
const town = computed(() => {
    return townsStore.hash[townId.value] || null;
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        await townsStore.fetchTown(townId.value);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${town.value.usename}`
        );

        if (town.value.status !== "open") {
            throw {
                code: "Un site fermé ne peut être modifié",
            };
        }
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}

function submit(...args) {
    return form.value.submit(...args);
}

function back() {
    if (townId.value) {
        backOrReplace(`/site/${townId.value}`);
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
