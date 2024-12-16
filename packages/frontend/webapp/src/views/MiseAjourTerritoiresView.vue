<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Formulaire inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez modifier le territoire d'intervention d'un
            utilisateur, mais nous ne parvenons pas à collecter les informations
            nécessaires. Vous pouvez réessayer un peu plus tard ou nous
            contacter en cas d'urgence.</template
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
        <template v-slot:title
            >Mise à jour des territoires d'intervention</template
        >
        <template v-slot:subtitle>
            {{ formatUserName(userRef) }}
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
                >Mettre à jour les territoires</Button
            >
        </template>

        <ContentWrapper size="large">
            <FormMiseAjourTerritoires ref="form" :user="userRef" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useAccesStore } from "@/stores/acces.store.js";
import { useUserStore } from "@/stores/user.store";
import router, { setDocumentTitle } from "@/helpers/router";
import backOrReplace from "@/utils/backOrReplace";
import formatUserName from "@/utils/formatUserName";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormMiseAjourTerritoires from "@/components/FormMiseAjourTerritoires/FormMiseAjourTerritoires.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const accesStore = useAccesStore();
const userStore = useUserStore();
const isLoading = ref(null);
const error = ref(null);
const form = ref(null);

onMounted(load);

let userRef = null;
const userId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        if (userId.value === userStore.user?.id) {
            throw {
                code: "Vous ne pouvez pas modifier vos propres territoires d'intervention",
            };
        }

        userRef = await accesStore.fetchUser(userId.value, true);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${formatUserName(
                userRef.value,
                false
            )}`
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
    if (userId.value) {
        backOrReplace(`/acces/${userId.value}`);
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
