<template>
    <header :class="responsive ? 'hidden 2xl:flex' : 'flex'"
        class="mb-10 flex-col lg:flex-row lg:justify-between lg:items-center print:hidden">
        <div class="flex space-x-4 items-center" :class="$slots.actions ? 'border-b pb-4 lg:border-0 lg:pb-0' : ''">
            <div class="rounded-full bg-primary w-16 h-16 flex justify-center items-center text-2xl text-white">
                <Icon :icon="icon" />
            </div>
            <div>
                <h1 class="text-xl font-bold">
                    <slot name="title" />
                </h1>
                <p class="text-G500">
                    <slot name="description" />
                </p>
            </div>
        </div>
        <div v-if="$slots.actions" class="mt-4 lg:mt-0">
            <slot name="actions" />
        </div>
    </header>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    responsive: {
        // si true, alors ce bloc se masque automatiquement sur les écrans < 2xl de largeur
        type: Boolean,
        required: false,
        default: false,
    },
});

const { icon, responsive } = toRefs(props);
</script>
