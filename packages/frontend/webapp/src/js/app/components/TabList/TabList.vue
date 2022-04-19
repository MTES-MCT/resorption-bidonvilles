<template>
    <div>
        <Tab
            v-for="tab in tabs"
            :key="tab.id"
            :active="activeTab === tab.id"
            @click.native="onTabClick(tab.id)"
            >{{ tab.label }}</Tab
        >
    </div>
</template>

<script>
import Tab from "./Tab.vue";

export default {
    components: {
        Tab
    },
    props: {
        tabs: {
            type: Array,
            required: true
        },
        value: {
            type: [String, Number],
            required: false
        }
    },
    data() {
        const defaultActiveTab =
            this.tabs.length > 0 ? this.tabs[0].id : undefined;

        return {
            activeTab: this.value !== undefined ? this.value : defaultActiveTab
        };
    },
    watch: {
        value() {
            this.activeTab = this.value;
        },
        tabs() {
            if (!this.tabs.some(({ id }) => id === this.activeTab)) {
                this.activeTab =
                    this.tabs.length > 0 ? this.tabs[0].id : undefined;
            }
        }
    },
    methods: {
        onTabClick(id) {
            this.activeTab = id;
            this.$emit("input", id);
        }
    }
};
</script>
