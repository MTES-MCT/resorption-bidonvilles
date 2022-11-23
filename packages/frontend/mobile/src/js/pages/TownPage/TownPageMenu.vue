<template>
    <div class="whitespace-nowrap overflow-y-auto py-4">
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
            currentSection: menu[0].id,
        };
    },
    components: {
        TownPageMenuItem,
    },
    methods: {
        changeSection(value) {
            this.currentSection = value;
        },
    },
};
</script>
