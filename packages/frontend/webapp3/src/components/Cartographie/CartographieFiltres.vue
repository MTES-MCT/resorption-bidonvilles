<template>
    <section class="px-4 pt-6 overflow-auto max-h-screen">
        <header class="font-bold text-lg mb-2">
            <h1>Filtrer les sites par</h1>
        </header>
        <div v-for="filterId in mapFilters.order" :key="filterId">
            <CartographieFiltre :id="filterId" />
        </div>
    </section>
</template>

<script setup>
import mapFilters from "@/utils/map_filters";
import CartographieFiltre from "./CartographieFiltre.vue";
</script>
