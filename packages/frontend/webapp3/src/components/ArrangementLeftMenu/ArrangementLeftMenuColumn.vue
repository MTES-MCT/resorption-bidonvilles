<template>
    <nav class="pr-8 border-r flex flex-col space-y-2">
        <h1 class="pl-3 font-bold" v-if="$slots.title">
            <slot name="title" />
        </h1>
        <RouterLink
            v-for="tab in tabs"
            :key="tab.id"
            :to="tab.route"
            replace
            class="border-l-4 pl-2 cursor-pointer"
            :class="
                tab.active
                    ? 'border-l-primary text-primary'
                    : 'border-l-transparent hover:underline'
            "
        >
            {{ tab.label }}
        </RouterLink>
    </nav>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
});

const { tabs } = toRefs(props);
</script>
