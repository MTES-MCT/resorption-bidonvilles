<template>
    <a
        :href="href"
        class="text-sm text-G800 font-bold border-b-2 border-b-transparent hover:border-b-G800 focus:outline-none focus:ring-2 ring-offset-2 ring-info"
        ><slot
    /></a>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    href: String,
});

const { href } = toRefs(props);
</script>
