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
        loadPermissionsToAccessJustice();
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
            loadedPermissionsToAccessJustice.value.reduce((argAcc, org) => {
                const acc = { ...argAcc };
                if (!acc[org.id]) {
                    let computedLocation = {};
                    if (org.location_type === "nation") {
                        computedLocation = {
                            label: "nation",
                            type: "",
                            name: "National",
                            code: null,
                        };
                    } else if (["region"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Région",
                            type: "region",
                            name: org.region_name,
                            code: org.region_code,
                        };
                    } else if (["departement"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Département",
                            type: "departement",
                            name: org.departement_name,
                            code: org.departement_code,
                        };
                    } else if (["epci"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Intercommunalité",
                            type: "epci",
                            name: org.epci_name,
                            code: org.epci_code,
                        };
                    } else if (["city"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Commune",
                            type: "city",
                            name: org.city_name,
                            code: org.city_code,
                        };
                    } else {
                        computedLocation = {
                            name: location.name,
                            code: null,
                        };
                    }
                    acc[org.id] = {
                        id: org.id,
                        name: org.name,
                        abbreviation: org.abbreviation,
                        type: {
                            category: org.type_category,
                            name: org.type_name,
                        },
                        location_name: computedLocation.name,
                        location: computedLocation,
                        users: [org],
                    };
                } else {
                    acc[org.id].users.push(org);
                }
                return acc;
            }, {});
    }
    console.log(
        `usersWithPermissionsToAccessJustice: ${JSON.stringify(
            usersWithPermissionsToAccessJustice
        )}`
    );

    return usersWithPermissionsToAccessJustice;
});

watch(loadedPermissionsToAccessJustice);
</script>
