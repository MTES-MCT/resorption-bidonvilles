<template>
    <div class="flex items-center text-xl">
        <div class="mr-2">
            <span class="font-bold">{{ population }}</span
            ><span class="sr-only">personnes sur site</span>
        </div>
        <div>
            <Icon icon="male" />{{ " " }}
            <span v-if="population >= 25"> <Icon icon="male" />{{ " " }}</span>
            <span v-if="population >= 75"> <Icon icon="male" />{{ " " }}</span>
            <span v-if="population >= 100"> <Icon icon="male" /></span>
        </div>
    </div>
    <div class="flex items-center gap-1" v-if="minors">
        <span class="text-sm">dont</span>
        <span class="font-bold text-lg">{{ minors }}</span>
        <span class="sr-only">mineurs sur le site</span>
        <Icon icon="children" class="text-lg" />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    population: {
        type: Number,
        required: true,
    },
    minors: {
        type: Number,
        required: false,
    },
});
const { population, minors } = toRefs(props);
</script>
