<template>
    <a
        :href="to"
        class="text-xs border-b-2 border-transparent hover:border-G500 focus:outline-none focus:ring-2 ring-offset-2 ring-info"
        ><slot
    /></a>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    to: String,
});

const { to } = toRefs(props);
</script>
