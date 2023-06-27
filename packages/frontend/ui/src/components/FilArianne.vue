<template>
    <nav class="flex items-center space-x-2 text-sm">
        <Icon icon="home" />
        <template v-for="(link, index) in links" :key="index">
            <span>&gt;</span>
            <Link :to="link.to">{{ link.label }}</Link>
        </template>
        <template v-if="activeItem">
            <span>&gt;</span>
            <span>{{ activeItem.label }}</span>
        </template>
    </nav>
</template>

<script setup>
import { computed, toRefs } from "vue";
import Icon from "./Icon.vue";
import Link from "./Link.vue";

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});
const { items } = toRefs(props);

const links = computed(() => {
    return items.value.slice(0, items.value.length - 1);
});
const activeItem = computed(() => {
    return items.value[items.value.length - 1];
});
</script>
