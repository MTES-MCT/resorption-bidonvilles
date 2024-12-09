<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <CartePhaseResorption
                v-for="phase in phases"
                :key="phase.preparatoryPhaseId"
                :phase="phase"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";

import CartePhaseResorption from "@/components/CartePhaseResorption/CartePhaseResorption.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const phases = computed(() => {
    return town.value.preparatoryPhasesTowardResorption;
});
</script>
