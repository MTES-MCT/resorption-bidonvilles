<template>
    <FicheRubrique title="Actions">
        <section class="grid grid-cols-2 gap-4 my-4">
            <CarteActionDeSite
                v-for="action in town.actions"
                :key="action.id"
                :action="action"
            />
        </section>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import CarteActionDeSite from "@/components/CarteActionDeSite/CarteActionDeSite.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
