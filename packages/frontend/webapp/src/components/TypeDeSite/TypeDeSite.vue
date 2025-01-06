<template>
    <div class="flex items-center customAlign">
        <Icon
            icon="map-marker-alt"
            class="text-lg"
            :style="`color: ${fieldType.color}`"
        />
        <span class="sr-only">Type de site</span>
        <div class="font-bold ml-1 whitespace-nowrap">
            {{ fieldType.label }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.customAlign {
    height: 30px;
}
</style>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    fieldType: {
        type: Object,
        required: true,
    },
});
const { fieldType } = toRefs(props);
</script>
