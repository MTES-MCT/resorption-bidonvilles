<template>
    <template v-if="flags.length > 0">
        <span
            v-for="flag in flags"
            :key="flag.icon"
            :class="`mx-px fi ${flag.icon}`"
            :title="flag.title"
        />
    </template>
    <span v-else class="text-G500">n/c</span>
</template>

<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
const flagMap = {
    french: { icon: "fi-fr", title: "Français(e)s" },
    european: { icon: "fi-eu", title: "Intra-communautaires" },
    other: { icon: "fi-un", title: "Extra-communautaires" },
};

const flags = computed(() => {
    return town.value.origins
        .map((origin) => flagMap[origin] || null)
        .filter((flag) => flag !== null);
});
</script>
