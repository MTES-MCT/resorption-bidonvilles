<template>
    <nav class="pr-8 border-r flex flex-col space-y-2 sticky top-4 self-start">
        <h1 class="pl-3 font-bold" v-if="$slots.title">
            <slot name="title" />
        </h1>

        <template v-for="tab in tabs" :key="tab.id">
            <Button
                v-if="tab.action"
                size="sm"
                @click="tab.action"
                class="self-start"
                ><Icon v-if="tab.icon" :icon="tab.icon" />
                {{ tab.label }}</Button
            >

            <RouterLink
                v-else
                :to="tab.route"
                class="border-l-4 pl-2 cursor-pointer"
                :class="[
                    tab.id === activeTab
                        ? activeClasses[tab.variant]
                        : 'border-l-transparent hover:underline',
                    classes[tab.variant],
                ]"
                replace
                ><Icon v-if="tab.icon" :icon="tab.icon" />
                {{ tab.label }}</RouterLink
            >
        </template>
    </nav>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { RouterLink } from "vue-router";
import { Icon, Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    activeTab: {
        type: String,
        required: false,
    },
});

const { tabs, activeTab } = toRefs(props);
const classes = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
};

const activeClasses = {
    primary: "border-l-primary",
    secondary: "border-l-secondary",
    tertiary: "border-l-tertiary",
    [undefined]: "border-l-primary text-primary",
};
</script>
