<template>
    <FicheSousRubrique :border="false">
        <p class="font-bold">Champs d'intervention</p>
        <p class="flex">
            <Tag
                v-for="topic in plan.topics"
                :key="topic.uid"
                :class="['mr-2']"
                >{{ topic.name }}</Tag
            >
        </p>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
