<template>
    <router-link v-if="isLocalLink" :to="to" :title="title" :class="classes"><slot /></router-link>
    <a v-else :href="to" :title="title" :class="classes"><slot /></a>
</template>

<script setup>
import { computed, toRefs } from "vue";
import focusClasses from '../../../../common/utils/focus_classes';

const props = defineProps({
    to: String,
    title: {
        type: String,
        default: "",
    }
});

const { to, title } = toRefs(props);
const isLocalLink = computed(() => to.value[0] === '/' && to.value.slice(-4) !== '.pdf');
const classes = [
    'text-xs border-b-2 border-transparent hover:border-G500',
    focusClasses.ring,
].join(' ');
</script>
