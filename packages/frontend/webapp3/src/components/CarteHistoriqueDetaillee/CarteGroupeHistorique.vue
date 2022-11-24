<template>
    <div class="flex justify-between">
        <ColonneDateHistorique
            :date="group.date"
            class="w-48 pr-4 mr-4 mt-4 border-r-4 border-blue100"
        ></ColonneDateHistorique>
        <ColonneCartesHistorique
            :items="group.items"
            class="flex-1 border-t pt-4"
        ></ColonneCartesHistorique>
    </div>
</template>
<script setup>
import { defineProps, toRefs } from "vue";
import ColonneDateHistorique from "./ColonneDateHistorique.vue";
import ColonneCartesHistorique from "./ColonneCartesHistorique.vue";

const props = defineProps({
    group: {
        type: Object,
    },
});
const { group } = toRefs(props);
</script>
