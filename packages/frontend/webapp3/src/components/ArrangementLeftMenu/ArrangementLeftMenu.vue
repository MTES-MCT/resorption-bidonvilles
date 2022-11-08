<template>
    <div class="flex space-x-8 justify-center">
        <ArrangementLeftMenuColumn
            :tabs="tabs"
            class="print:hidden"
            :class="columnWidthClass"
        >
            <template v-slot:title v-if="$slots.menuTitle"
                ><slot name="menuTitle"
            /></template>
        </ArrangementLeftMenuColumn>

        <div class="flex-1" :class="maxWClass">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import ArrangementLeftMenuColumn from "./ArrangementLeftMenuColumn.vue";

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    maxWClass: {
        type: String,
        required: false,
        default: null,
    },
    columnWidthClass: {
        type: String,
        required: false,
        default: null,
    },
});

const { tabs, maxWClass } = toRefs(props);
</script>
