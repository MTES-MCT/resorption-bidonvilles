<template>
    <header class="px-6">
        <Tag
            :variant="pinVariant"
            :class="['text-xs uppercase', isHover ? 'shadow-md' : '']"
            class="mt-1"
        >
            {{ lastUpdate }}
        </Tag>
        <Tag
            v-if="heatwaveStatus === true"
            variant="highlight"
            :class="[
                'ml-4 text-xs uppercase text-primary',
                isHover ? 'shadow-md' : '',
            ]"
        >
            Risque Canicule
        </Tag>
        <ResorptionTargetTag
            class="ml-4"
            v-if="shantytown.resorptionTarget"
            :target="shantytown.resorptionTarget"
            :isHover="isHover"
        />
    </header>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import getSince from "@/utils/getSince";
import formatLastUpdatedAt from "@/utils/formatLastUpdatedAt";

import { Tag } from "@resorptionbidonvilles/ui";
import ResorptionTargetTag from "@/components/TagObjectifResorption/TagObjectifResorption.vue";

const props = defineProps({
    shantytown: Object,
    isHover: {
        type: Boolean,
        default: false,
    },
});
const { shantytown, isHover } = toRefs(props);

const pinVariant = computed(() => {
    const { months } = getSince(shantytown.value.updatedAt);
    return months >= 3 ? "pin_red" : "pin";
});
const lastUpdate = computed(() => {
    return `${formatLastUpdatedAt(shantytown.value)}`;
});
const heatwaveStatus = computed(() => {
    return shantytown.value.heatwaveStatus;
});
</script>
