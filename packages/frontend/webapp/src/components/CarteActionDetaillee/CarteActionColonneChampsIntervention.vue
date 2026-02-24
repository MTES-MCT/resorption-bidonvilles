<template>
    <div
        class="items-start flex flex-col gap-2"
        tabindex="0"
        aria-label="Liste des étiquettes caractérisant l'action"
    >
        <DsfrTag
            v-for="topic in topics"
            v-bind:key="topic.name"
            tabindex="0"
            :aria-label="`Etiquette ${topic.name}`"
            :tagName="`Etiquette ${topic.name}`"
            :label="topic.name"
            selectable
            @click.prevent="() => {}"
        />
    </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    topics: {
        type: Object,
    },
});
const { topics } = toRefs(props);
</script>
