<template>
    <div>
        <PlanFilters class="mb-10" />
        <p class="text-center text-G600 italic pb-10">
            Aucune action ne correspond aux filtres et territoire sélectionnés
        </p>
    </div>
</template>

<script>
import PlanFilters from "./PlanFilters.vue";

export default {
    components: {
        PlanFilters
    }
};
</script>
