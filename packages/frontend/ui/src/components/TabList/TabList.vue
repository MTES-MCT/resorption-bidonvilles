<template>
    <div>
        <Tab v-for="tab in tabs" :key="tab.id" :active="activeTab === tab.id" @click="onTabClick(tab.id)">
            <template v-if="tab.id === 'inProgress'" v-slot:ofwhich>dont</template>
            <template v-if="tab.total !== undefined" v-slot:prefix>{{ tab.total }}</template>
            {{ tab.label }}
        </Tab>
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
        modelValue: {
            type: [String, Number],
            required: false
        }
    },
    data() {
        const defaultActiveTab =
            this.tabs.length > 0 ? this.tabs[0].id : undefined;

        return {
            activeTab: this.modelValue !== undefined ? this.modelValue : defaultActiveTab
        };
    },
    watch: {
        modelValue() {
            this.activeTab = this.modelValue;
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
            this.$emit("update:modelValue", id);
        }
    }
};
</script>
