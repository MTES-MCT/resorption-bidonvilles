<template>
    <div
        class="whitespace-nowrap overflow-y-auto py-4 border-t-1 border-b-1 border-blue600"
    >
        <TownPageMenuItem
            v-for="(section, index) in menu"
            :key="section.id"
            :item="section"
            :isSelected="section.id === currentSection"
            @click="changeSection(section.id)"
            :class="index !== 0 ? 'border-l-1' : ''"
        />
    </div>
</template>

<script>
import menu from "./TownPage.menu";

import TownPageMenuItem from "./TownPageMenuItem.vue";

export default {
    data() {
        return {
            menu,
        };
    },
    props: {
        currentSection: { type: String },
    },
    components: {
        TownPageMenuItem,
    },
    methods: {
        changeSection(value) {
            this.$emit("changeSection", value);
        },
    },
};
</script>
