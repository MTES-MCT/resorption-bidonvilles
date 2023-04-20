<template>
    <IndicateursRow>
        <template v-slot:left>
            <div
                class="border-l border-G400 h-full flex items-center"
                :class="{
                    'border-y': withoutTopBorder === false,
                    'border-b': withoutTopBorder === true,
                }"
            >
                <div
                    class="px-4 flex-1 grid grid-cols-[40px_minmax(100px,_1fr)]"
                    :class="{
                        'py-4': withoutPadding === false,
                    }"
                >
                    <p class="text-primary text-xl">
                        <Icon v-if="icon" :icon="icon" />
                    </p>
                    <p class="text-md"><slot name="label" /></p>
                </div>
                <div>
                    <slot name="left" />
                </div>
            </div>
        </template>

        <template v-slot:right>
            <div
                class="border-r border-G400 h-full flex justify-items-stretch"
                :class="{
                    'border-y': withoutTopBorder === false,
                    'border-b': withoutTopBorder === true,
                }"
            >
                <slot name="right" />
            </div>
        </template>
    </IndicateursRow>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";
import IndicateursRow from "./IndicateursRow.vue";

const props = defineProps({
    icon: {
        type: String,
        required: false,
    },
    withoutPadding: {
        type: Boolean,
        default: false,
    },
    withoutTopBorder: {
        type: Boolean,
        default: false,
    },
});
const { icon, withoutPadding, withoutTopBorder } = toRefs(props);
</script>
