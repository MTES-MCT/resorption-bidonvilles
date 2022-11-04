<template>
    <div>
        <section class="flex flex-col space-y-4">
            <CarteActionDetaillee
                v-for="plan in plansStore.currentPage.content"
                :key="plan.id"
                :plan="plan"
            />
        </section>
        <BottomPagination
            :from="plansStore.currentPage.from"
            :to="plansStore.currentPage.to"
            :total="plansStore.filteredPlans.length"
            :currentPage="plansStore.currentPage.index"
            :numberOfPages="plansStore.numberOfPages"
            @pagechange="changePage"
        />
    </div>
</template>

<script setup>
import { usePlansStore } from "@/stores/plans.store";
import { BottomPagination } from "@resorptionbidonvilles/ui";
import CarteActionDetaillee from "@/components/CarteActionDetaillee/CarteActionDetaillee.vue";

const plansStore = usePlansStore();
function changePage(page) {
    plansStore.currentPage.index = page;
}
</script>
