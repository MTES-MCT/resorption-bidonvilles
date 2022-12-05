<template>
    <FicheRubrique title="Actions">
        <section class="grid grid-cols-2 gap-4 my-4">
            <CarteActionDeSite
                v-for="plan in town.plans"
                :key="plan.plan_id"
                :plan="plan"
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
