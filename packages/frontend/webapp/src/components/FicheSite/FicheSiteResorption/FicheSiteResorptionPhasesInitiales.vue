<template>
    <div class="bg-G100">
        <div class="mb-4 pl-2 p-1 text-lg font-bold">Phases Initiales</div>
        <div
            class="grid md:grid-cols-3 justify-between items-center gap-2 mb-2"
        >
            <CartePhaseResorption
                v-for="phase in phases_initiales"
                :key="phase.preparatoryPhaseId"
                :phase="phase"
                :is_initial_phase="true"
            />
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CartePhaseResorption from "@/components/CartePhaseResorption/CartePhaseResorption.vue";

const props = defineProps({
    phases_initiales: Array,
});
const { phases_initiales } = toRefs(props);
</script>
