<template>
    <div
        class="items-center"
        tabindex="0"
        aria-label="Liste des étiquettes caractérisant l'action"
    >
        <Tag
            variant="primary"
            v-for="topic in topics"
            v-bind:key="topic.name"
            tabindex="0"
            :aria-label="`Etiquette ${topic.name}`"
        >
            {{ topic.name }}
        </Tag>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    topics: {
        type: Object,
    },
});
const { topics } = toRefs(props);
</script>
