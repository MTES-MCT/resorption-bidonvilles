<template>
    <span class="font-bold">{{ data.city.name }}</span
    ><br /><span class="text-sm">{{ data.city.code }}</span>
    <!-- @todo 1904: afficher le code postal ? -->
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
