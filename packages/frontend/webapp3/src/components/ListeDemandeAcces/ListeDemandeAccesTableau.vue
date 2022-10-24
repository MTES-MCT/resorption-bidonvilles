<template>
    <div>
        <div class="tableau-acces border-b-2 border-G800 bg-G300 font-bold">
            <p>Statut du compte</p>
            <p>NOM Prénom</p>
            <p>Structure</p>
            <p>Territoire</p>
            <p>Type d'accès</p>
        </div>
        <ListeDemandeAccesLigne
            class="tableau-acces"
            v-for="(user, index) in accesStore.currentPage.content"
            :key="user.id"
            :user="user"
            :odd="index % 2 !== 0"
        />

        <p class="text-right text-sm text-G500 mt-1">
            Vous consultez actuellement les lignes
            {{ accesStore.currentPage.from }} à
            {{ accesStore.currentPage.to }} sur
            <span class="font-bold">{{ accesStore.total }} résultats</span>
        </p>
        <div class="flex justify-center mt-4">
            <div>
                <Pagination
                    class="mx-auto"
                    :currentPage="accesStore.currentPage.index"
                    :nbPages="accesStore.numberOfPages"
                    @pagechange="changePage"
                />
            </div>
        </div>
    </div>
</template>

<style>
.tableau-acces {
    @apply grid grid-cols-5;
}

.tableau-acces > div,
.tableau-acces > p {
    @apply p-3;
}
</style>

<script setup>
import { Pagination } from "@resorptionbidonvilles/ui";
import { useAccesStore } from "@/stores/acces.store";
import ListeDemandeAccesLigne from "./ListeDemandeAccesLigne.vue";

const accesStore = useAccesStore();

function changePage(page) {
    accesStore.currentPage.index = page;
}
</script>
