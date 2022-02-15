<template>
    <component :is="component" v-bind="item">
        <slot />
    </component>
</template>

<script>
import DashboardFilter from "./DashboardFilter";
import DashboardFiltersSeparator from "./DashboardFiltersSeparator";

export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: {
        DashboardFilter,
        DashboardFiltersSeparator
    },
    computed: {
        component() {
            return this.item.type === "separator"
                ? DashboardFiltersSeparator
                : DashboardFilter;
        }
    }
};
</script>
