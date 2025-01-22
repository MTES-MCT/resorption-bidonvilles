<template>
    <FicheSousRubrique>
        <p class="font-bold">Champs d'intervention</p>
        <p class="flex">
            <Tag
                v-for="topic in action.topics"
                :key="topic.uid"
                class="mr-2 rounded-lg !bg-blue100 text-primary"
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
    action: Object,
});
const { action } = toRefs(props);
</script>
