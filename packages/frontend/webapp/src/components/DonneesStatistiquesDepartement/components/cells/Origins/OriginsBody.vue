<template>
    <template v-if="flags.length > 0">
        <div class="flex flex-wrap">
            <img
                v-for="flag in flags"
                :key="flag.icon"
                :src="flag.icon"
                class="mx-px pt-1 w-6"
            />
        </div>
    </template>
    <span v-else class="text-G500">n/c</span>
</template>

<script setup>
import { computed, toRefs } from "vue";

import flagFR from "@/assets/img/flags/fr.png";
import flagEU from "@/assets/img/flags/eu.png";
import flagExtraCommunautaires from "@/assets/img/flags/extra-communautaires.png";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
const flagMap = {
    french: { icon: flagFR, title: "Français(e)s" },
    european: { icon: flagEU, title: "Intra-communautaires" },
    other: { icon: flagExtraCommunautaires, title: "Extra-communautaires" },
};

const flags = computed(() => {
    return town.value.origins
        .map((origin) => flagMap[origin] || null)
        .filter((flag) => flag !== null);
});
</script>
