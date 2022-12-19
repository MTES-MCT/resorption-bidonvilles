<template>
    <div
        class="whitespace-nowrap overflow-y-auto py-4 bg-G300 border-b-2 border-G400"
        ref="menu"
    >
        <TownPageMenuItem
            v-for="(section, index) in menu"
            :id="`item-${section.id}`"
            :key="section.id"
            :item="section"
            :isSelected="section.id === currentSection"
            @click="changeSection(section.id)"
            :class="index !== 0 ? 'border-l-1' : ''"
        />
    </div>
</template>

<script>
import TownPageMenuItem from "./TownPageMenuItem.vue";

export default {
    props: {
        menu: { type: Object },
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
    watch: {
        currentSection() {
            const item = document.getElementById(`item-${this.currentSection}`);
            if (item) {
                this.$refs.menu.scrollLeft = item.offsetLeft - 15;
            }
        },
    },
};
</script>
