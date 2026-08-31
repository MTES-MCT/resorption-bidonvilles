<template>
    <section>
        <CarteHistoriqueDetaillee
            v-for="(item, index) in items"
            :key="index"
            :activity="item"
            :class="index < items.length - 1 ? 'pb-6 border-b-1 mb-6' : ''"
        />
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import CarteHistoriqueDetaillee from "./CarteHistoriqueDetaillee.vue";

const props = defineProps({
    items: Array,
});
const { items } = toRefs(props);
</script>
