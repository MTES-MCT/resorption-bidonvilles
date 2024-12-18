<template>
    <div class="grid grid-cols-3 grid-rows-2 gap-8 justify-around p-2">
        <TableauDeBordCard
            v-for="(card, index) in cards"
            :key="index"
            :cardKey="card.name"
            :cardName="card.name"
            :cardActions="card.actions"
            :cardIcon="card.icon"
            :cardOptions="card.options || null"
            class="grid grid-rows-1"
        />
    </div>
</template>

<script setup>
import { toRefs } from "vue";

import TableauDeBordCard from "./TableauDeBordCard.vue";

const props = defineProps({
    cards: [],
});

const { cards } = toRefs(props);
</script>
