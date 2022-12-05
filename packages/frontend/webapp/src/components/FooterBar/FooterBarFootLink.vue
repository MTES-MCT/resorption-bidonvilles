<template>
    <a
        :href="to"
        class="text-xs border-b-2 border-transparent hover:border-G500"
        ><slot
    /></a>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    to: String,
});

const { to } = toRefs(props);
</script>
