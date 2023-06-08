<template>
    <FilArianne />
    <Title class="mt-6">{{ departement.name }} ({{ departement.code }})</Title>

    {{ metrics }}
</template>

<script setup>
import { toRefs } from "vue";
import FilArianne from "../DonneesStatistiques/FilArianne.vue";
import Title from "../DonneesStatistiques/Title.vue";

const props = defineProps({
    departement: {
        type: Object,
        required: true,
    },
    metrics: {
        type: Object,
        required: true,
    },
});
const { departement, metrics } = toRefs(props);
</script>
