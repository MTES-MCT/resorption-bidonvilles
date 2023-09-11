<template>
    <div
        class="flex"
        tabindex="0"
        :aria-label="`Département concerné par l'action ${departement.name}`"
    >
        <div class="ml-2 flex-grow">
            <span> {{ departement.name }} ({{ departement.code }}) </span>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    departement: {
        type: Object,
    },
});
const { departement } = toRefs(props);
</script>
