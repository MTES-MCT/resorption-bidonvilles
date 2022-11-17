<template>
    <div>
        <CarteHistoriqueDetaillee
            v-for="(item, index) in items"
            :key="index"
            :activity="item"
            v-bind:class="{
                'pb-6 border-b-1 mb-6': index < items.length - 1,
            }"
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteHistoriqueDetaillee from "./CarteHistoriqueDetaillee.vue";

const props = defineProps({
    items: {
        type: Array,
    },
});
const { items } = toRefs(props);
</script>
