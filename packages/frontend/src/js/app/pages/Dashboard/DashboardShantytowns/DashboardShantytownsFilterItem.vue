<template>
    <component :is="component" v-bind="item">
        <slot />
    </component>
</template>

<script>
import DashboardShantytownsFilter from "./DashboardShantytownsFilter";
import DashboardShantytownsFiltersSeparator from "./DashboardShantytownsFiltersSeparator";

export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: {
        DashboardShantytownsFilter,
        DashboardShantytownsFiltersSeparator
    },
    computed: {
        component() {
            return this.item.type === "separator"
                ? DashboardShantytownsFiltersSeparator
                : DashboardShantytownsFilter;
        }
    }
};
</script>
