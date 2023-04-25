<template>
    <FicheRubrique title="Financements" id="financements">
        <ActionFinances
            :minYear="minYear"
            :maxYear="maxYear"
            :finances="action.finances"
        />
    </FicheRubrique>
</template>

<script setup>
import { toRefs, computed } from "vue";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import ActionFinances from "@/components/ActionFinances/ActionFinances.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const minYear = computed(() => {
    return new Date(action.value.started_at).getFullYear();
});

const maxYear = computed(() => {
    if (!action.value.ended_at) {
        return new Date().getFullYear();
    }

    return new Date(action.value.ended_at).getFullYear();
});
</script>
