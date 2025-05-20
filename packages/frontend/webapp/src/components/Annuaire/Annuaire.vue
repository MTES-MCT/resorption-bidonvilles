<template>
    <Loading class="mt-16" v-if="directoryStore.isLoading" />
    <AnnuaireErreur v-else-if="directoryStore.error" />

    <template v-else>
        <AnnuaireBanniere v-model:search="search" />

        <ViewHeader icon="users">
            <template v-slot:title
                >Découvrez notre communauté —
                <span class="text-info">{{ title }}</span></template
            >
            <template v-slot:description>
                Retrouvez ici les coordonnées des structures et personnes
                inscrites sur la plateforme
            </template>
            <template v-slot:actions>
                <Link to="/invitation?from=annuaire"
                    ><Icon icon="user-plus" /> Inviter des utilisateurs</Link
                >
            </template>
        </ViewHeader>

        <AnnuaireHeader
            :location="directoryStore.filters.location"
            :search="directoryStore.filters.search"
        />
        <AnnuaireFiltres class="mt-6 mb-4" />

        <AnnuaireContent v-if="directoryStore.total > 0" />
        <div v-else class="border-t pt-12">
            <AnnuaireVide />
        </div>
    </template>
</template>

<script setup>
import router from "@/helpers/router";
import { computed } from "vue";
import { Icon, Link } from "@resorptionbidonvilles/ui";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import { useDirectoryStore } from "@/stores/directory.store";

import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import AnnuaireErreur from "./AnnuaireErreur.vue";
import AnnuaireBanniere from "./AnnuaireBanniere.vue";
import AnnuaireHeader from "./AnnuaireHeader.vue";
import AnnuaireFiltres from "./AnnuaireFiltres.vue";
import AnnuaireContent from "./AnnuaireContent.vue";
import AnnuaireVide from "./AnnuaireVide.vue";
import Loading from "../Loading/Loading.vue";

const directoryStore = useDirectoryStore();

const search = computed({
    get() {
        return {
            search: "",
            data: null,
        };
    },
    set(newValue) {
        if (newValue) {
            if (newValue.data?.type === "user") {
                router.push(`/annuaire/${newValue.data.organization_id}`);
            } else if (newValue.data?.type === "organization") {
                router.push(`/structure/${newValue.data.id}`);
            } else {
                // location ou recherche textuelle
                directoryStore.filters.search = newValue.search;
                directoryStore.filters.location = newValue.data;
            }
        } else {
            directoryStore.filters.search = "";
            directoryStore.filters.location = null;
        }
    },
});

const title = computed(() => {
    return computeLocationSearchTitle(search.value.search, search.value.data);
});
</script>
