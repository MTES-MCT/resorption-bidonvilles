<template>
    <DsfrBadge
        v-if="resorptionTarget"
        :noIcon="noicon"
        :label="objectifResorptionLabel(resorptionTarget)"
        type="info"
        :small="small"
        class="text-xs py-1.5 mr-2"
        :class="{ 'mt-1': !small, '!py-2': !small }"
    />
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
    resorptionTarget: {
        type: String,
        default: null,
    },
    noicon: {
        type: Boolean,
        default: false,
    },
    small: {
        type: Boolean,
        default: false,
    },
});
const { resorptionTarget, noicon } = toRefs(props);

function objectifResorptionLabel(target) {
    return `Objectif résorption ${target} par la Préfecture`;
}
</script>
