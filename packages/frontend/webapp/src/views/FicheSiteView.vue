<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Fiche site inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter la fiche détaillée d'un site, mais nous
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

    <Layout :paddingBottom="false" v-else>
        <FicheSite
            :town="town"
            :permissionsToAccessJustice="permissionsToAccessJustice"
            :v-if="town"
        />
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useTownsStore } from "@/stores/towns.store.js";
import router from "@/helpers/router";
import { trackEvent } from "@/helpers/matomo";

import { Button } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import FicheSite from "@/components/FicheSite/FicheSite.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import { fetchAll } from "@/api/permissions.api";
import getReducedLoadedPermissionsToAccessJustice from "@common/helpers/permission/getReducedLoadedPermissionsToAccessJustice";

const townsStore = useTownsStore();
const isLoading = ref(null);
const error = ref(null);
const town = ref(null);
const loadedPermissionsToAccessJustice = ref(null);

const townId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

onMounted(mount);
watch(townId, mount);

function mount() {
    trackEvent("Site", "Visite page site", `S${townId.value}`);
    load();
}

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        town.value = await townsStore.fetchTown(townId.value);
        townsStore.townCategoryFilter = [];
        await loadPermissionsToAccessJustice();
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}

async function loadPermissionsToAccessJustice() {
    try {
        const location = {
            type: "city",
            city: town.value.city,
            epci: town.value.epci,
            departement: town.value.departement,
            region: town.value.region,
        };
        loadedPermissionsToAccessJustice.value = await fetchAll(location);
    } catch (e) {
        // Do nothing
    }
}

const permissionsToAccessJustice = computed(() => {
    let usersWithPermissionsToAccessJustice = [];
    if (loadedPermissionsToAccessJustice.value) {
        usersWithPermissionsToAccessJustice =
            getReducedLoadedPermissionsToAccessJustice(
                loadedPermissionsToAccessJustice.value
            );
    }
    return usersWithPermissionsToAccessJustice;
});
</script>
