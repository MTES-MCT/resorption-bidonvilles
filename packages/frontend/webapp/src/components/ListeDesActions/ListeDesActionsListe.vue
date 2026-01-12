<template>
    <div>
        <section class="flex flex-col space-y-4">
            <CarteActionDetaillee
                v-for="action in actionsStore.currentPage.content"
                :key="action.id"
                :action="action"
            />
        </section>
        <BottomPagination
            :from="actionsStore.currentPage.from"
            :to="actionsStore.currentPage.to"
            :total="
                actionsStore.filteredActions[actionsStore.filters.status].length
            "
            :currentPage="actionsStore.currentPage.index"
            :numberOfPages="actionsStore.numberOfPages"
            @pagechange="changePage"
        />
    </div>
</template>

<script setup>
import { useActionsStore } from "@/stores/actions.store";
import { BottomPagination } from "@resorptionbidonvilles/ui";
import CarteActionDetaillee from "@/components/CarteActionDetaillee/CarteActionDetaillee.vue";

const actionsStore = useActionsStore();
function changePage(page) {
    actionsStore.currentPage.index = page;
}
</script>
