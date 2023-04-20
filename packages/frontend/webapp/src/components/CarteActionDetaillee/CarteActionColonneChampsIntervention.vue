<template>
    <div class="items-center">
        <Tag variant="primary" v-for="topic in topics" v-bind:key="topic.name">
            {{ topic.name }}
        </Tag>
    </div>
</template>

<script setup>
import { toRefs } from "vue";

import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    topics: {
        type: Object,
    },
});
const { topics } = toRefs(props);
</script>
