<template>
    <header :class="classes.header.value">
        <div
            class="flex space-x-4 items-center"
            :class="$slots.actions ? classes.title.value : ''"
        >
            <div
                class="rounded-full bg-primary w-16 h-16 flex justify-center items-center text-2xl text-white shrink-0"
            >
                <Icon :icon="icon" />
            </div>
            <div>
                <p class="text-[1.5rem] font-bold leading-[1.8rem] break-all">
                    <slot name="title" />
                </p>
                <p class="text-G700">
                    <slot name="description" />
                </p>
            </div>
        </div>
        <div v-if="$slots.actions" :class="classes.actions.value">
            <slot name="actions" />
        </div>
    </header>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
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
    direction: {
        type: String, // soit "col" pour un layout en colonne, soit "row" pour un layout en ligne (à partir d'une certaine largeur d'écran !)
        required: false,
        default: "row",
    },
});

const { icon, responsive, direction } = toRefs(props);
const classes = {
    header: computed(() => {
        const c = ["print:hidden"];
        if (responsive.value === true) {
            c.push("hidden 2xl:flex");
        } else {
            c.push("flex");
        }

        c.push("flex-col mb-10");
        if (direction.value === "row") {
            c.push("lg:flex-row lg:justify-between lg:items-center");
        }

        return c.join(" ");
    }),
    title: computed(() => {
        const c = ["border-b pb-4"];
        if (direction.value === "row") {
            c.push("lg:border-0 lg:pb-0");
        }

        return c.join(" ");
    }),
    actions: computed(() => {
        const c = ["mt-4"];
        if (direction.value === "row") {
            c.push("lg:mt-0");
        }

        return c.join(" ");
    }),
};
</script>
