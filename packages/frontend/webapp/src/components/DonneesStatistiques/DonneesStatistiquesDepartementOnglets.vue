<template>
    <div class="bg-blue100 pt-4 px-6">
        <Tab
            @click="switchTab(tab.id)"
            v-for="tab in tabs"
            :key="tab.id"
            :active="tab.id === activeTab"
        >
            {{ tab.label }}</Tab
        >
    </div>
</template>

<script setup>
import { toRefs } from "vue";

import Tab from "./Tab.vue";

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    activeTab: {
        type: String,
        required: true,
    },
});

const { tabs, activeTab } = toRefs(props);

const emit = defineEmits(["switch"]);

function switchTab(tabId) {
    emit("switch", tabId);
}
</script>
