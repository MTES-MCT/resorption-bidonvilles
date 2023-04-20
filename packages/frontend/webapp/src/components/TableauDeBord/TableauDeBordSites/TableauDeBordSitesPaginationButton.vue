<template>
    <div
        :class="[
            'w-12 h-12 items-center flex flex-col justify-center rounded-full border-1 cursor-pointer border-primary text-primary hover:bg-blue100',
            additionalClasses,
        ]"
    >
        <Icon :icon="icon" />
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { icon, disabled } = toRefs(props);

const additionalClasses = computed(() => {
    if (disabled.value) {
        return "opacity-50 cursor-not-allowed";
    }

    return "";
});
</script>
