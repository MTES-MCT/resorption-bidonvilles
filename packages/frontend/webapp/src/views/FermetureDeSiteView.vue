<template>
    <LayoutLoading v-if="isLoading !== false"></LayoutLoading>

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Formulaire inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez déclarer la fermeture d'un site, mais nous ne
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

    <LayoutForm size="intermediate" v-else>
        <template v-slot:title>Fermeture du site</template>
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
            <Button @click="submit" :loading="form?.isSubmitting">{{
                submitWording
            }}</Button>
        </template>

        <ContentWrapper size="intermediate">
            <FormFermetureDeSite :town="town" ref="form" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useTownsStore } from "@/stores/towns.store.js";
import { useUserStore } from "@/stores/user.store";
import router, { setDocumentTitle } from "@/helpers/router";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormFermetureDeSite from "@/components/FormFermetureDeSite/FormFermetureDeSite.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

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

const submitWording = computed(() => {
    return town.value.status === "open"
        ? "Fermer le site"
        : "Corriger la fermeture";
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const userStore = useUserStore();
        await townsStore.fetchTown(townId.value);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${town.value.usename}`
        );

        if (town.value.status === "open") {
            if (
                !userStore.hasLocalizedPermission(
                    "shantytown.close",
                    town.value
                )
            ) {
                throw {
                    code: "Permissions insuffisantes",
                };
            }
        } else if (
            !userStore.hasLocalizedPermission(
                "shantytown.fix_status",
                town.value
            )
        ) {
            throw {
                code: "Site déjà fermé",
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
    router.back();
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
