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

    <FermetureDeSite :town="town" v-else />
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useTownsStore } from "@/stores/towns.store.js";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import FermetureDeSite from "@/components/FermetureDeSite/FermetureDeSite.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const townsStore = useTownsStore();
const isLoading = ref(null);
const error = ref(null);
const town = ref(null);

onMounted(load);

const townId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const userStore = useUserStore();
        town.value = await townsStore.fetchTown(townId.value);

        if (town.value.value.status === "open") {
            if (
                !userStore.hasLocalizedPermission(
                    "shantytown.close",
                    town.value.value
                )
            ) {
                throw {
                    code: "Permissions insuffisantes",
                };
            }
        } else if (
            !userStore.hasLocalizedPermission(
                "shantytown.fix_status",
                town.value.value
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
</script>
