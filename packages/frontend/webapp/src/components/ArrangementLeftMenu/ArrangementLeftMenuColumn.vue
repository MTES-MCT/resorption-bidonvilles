<template>
    <nav
        class="bg-white sticky top-0 pb-8 self-start z-10 border-b-2 flex flex-col w-full items-start sm:w-auto sm:border-b-0 sm:border-r-1 sm:pr-8 gap-2"
    >
        <p class="pl-3 font-bold" v-if="$slots.title">
            <slot name="title" />
        </p>

        <template v-for="tab in tabs" :key="tab.id">
            <DsfrButton
                v-if="tab.action"
                size="sm"
                @click="tab.action"
                class="self-start"
                ><Icon v-if="tab.icon" :icon="tab.icon" />
                {{ tab.label }}</DsfrButton
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
                    focusClasses.ring,
                ]"
                replace
                ><Icon v-if="tab.icon" :icon="tab.icon" /> {{ tab.label }}
                <Icon
                    v-if="tab.postIcon"
                    :icon="tab.postIcon"
                    :class="tab.iconColor ? `text-${tab.iconColor}` : ''"
                />
            </RouterLink>
        </template>
    </nav>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "@resorptionbidonvilles/ui";
import focusClasses from "@common/utils/focus_classes";

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
    tertiary: "text-tertiaryA11Y",
    red: "text-red",
};

const activeClasses = {
    primary: "border-l-primary",
    secondary: "border-l-secondary",
    tertiary: "border-l-tertiary",
    red: "border-l-red",
    [undefined]: "border-l-primary text-primary",
};
</script>
