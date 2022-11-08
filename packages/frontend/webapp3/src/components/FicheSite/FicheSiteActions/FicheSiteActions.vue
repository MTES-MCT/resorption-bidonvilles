<template>
    <FicheSiteRubrique title="Actions"> test </FicheSiteRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import FicheSiteRubrique from "../FicheSiteRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
