<template>
    <FicheSousRubrique>
        <p>
            <span class="font-bold">{{ town }}</span
            ><br />
            {{ diagnostic }}
        </p>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
