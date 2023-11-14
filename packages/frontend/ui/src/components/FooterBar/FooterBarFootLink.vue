<template>
    <router-link v-if="isLocalLink" :to="to" :title="title" :class="classes"><slot /></router-link>
    <a v-else="to[0] === '/'" :href="to" :title="title" :class="classes"><slot /></a>
</template>

<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
    to: String,
    title: {
        type: String,
        default: "",
    }
});

const { to, title } = toRefs(props);
const isLocalLink = computed(() => to.value[0] === '/' && to.value.slice(-4) !== '.pdf');
const classes = 'text-xs border-b-2 border-transparent hover:border-G500 focus:outline-none focus:ring-2 ring-offset-2 ring-info';
</script>
