<template>
    <component :is="component" v-bind="item">
        <slot />
    </component>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import TableauDeBordSiteFiltreItem from "./TableauDeBordSiteFiltreItem.vue";
import TableauDeBordSiteFiltreSeparator from "./TableauDeBordSiteFiltreSeparator.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});
const { item } = toRefs(props);

const component = computed(() => {
    return item.value.type === "separator"
        ? TableauDeBordSiteFiltreSeparator
        : TableauDeBordSiteFiltreItem;
});
</script>
