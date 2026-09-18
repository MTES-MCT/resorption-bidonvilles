<template>
    <FicheRubrique
        title="Financements"
        id="financements"
        category="financements"
        entityType="action"
    >
        <p v-if="action.hasDihalFinancing" class="mb-4">
            ID Chorus :
            <DsfrTagCopy :label="ACCOUNTING_REFERENCE" dataType="ID Chorus" />
        </p>

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
import DsfrTagCopy from "@/components/DsfrTagCopy/DsfrTagCopy.vue";

const ACCOUNTING_REFERENCE = "0177-01-02-11-41";

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
