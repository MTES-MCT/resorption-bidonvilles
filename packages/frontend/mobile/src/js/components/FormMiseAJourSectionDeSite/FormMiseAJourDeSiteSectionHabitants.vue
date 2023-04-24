<template>
    <h1 class="text-2xl sm:text-3xl font-bold px-5">Habitants</h1>
    <p class="px-5">
        Situation du site au
        {{ formatDate(today.getTime() / 1000, "d M y") }}
    </p>
    <InputPopulation class="px-5" />
    <InputSocialOrigins class="px-5" />
</template>
<script setup>
import formatDate from "#frontend/common/utils/formatDate";
import InputPopulation from "./inputs/InputPopulation.vue";
import InputSocialOrigins from "./inputs/InputSocialOrigins.vue";

const today = new Date();
</script>
