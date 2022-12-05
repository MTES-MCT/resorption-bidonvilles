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

        <BottomPagination
            :from="accesStore.currentPage.from"
            :to="accesStore.currentPage.to"
            :total="accesStore.total"
            :currentPage="accesStore.currentPage.index"
            :numberOfPages="accesStore.numberOfPages"
            @pagechange="changePage"
        />
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
import { BottomPagination } from "@resorptionbidonvilles/ui";
import { useAccesStore } from "@/stores/acces.store";
import ListeDemandeAccesLigne from "./ListeDemandeAccesLigne.vue";

const accesStore = useAccesStore();

function changePage(page) {
    accesStore.currentPage.index = page;
}
</script>
