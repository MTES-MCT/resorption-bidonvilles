<template>
    <div class="flex">
        <div class="ml-2 flex-grow">
            <span> {{ departement.name }} ({{ departement.code }}) </span>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    departement: {
        type: Object,
    },
});
const { departement } = toRefs(props);
</script>
