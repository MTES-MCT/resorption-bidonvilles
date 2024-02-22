<template>
    <div class="flex items-center">
        <div class="mr-2">
            {{ population }} <span class="sr-only">personnes sur site</span>
        </div>
        <div>
            <Icon icon="male" />{{ " " }}
            <span v-if="population >= 25"> <Icon icon="male" />{{ " " }}</span>
            <span v-if="population >= 75"> <Icon icon="male" />{{ " " }}</span>
            <span v-if="population >= 100"> <Icon icon="male" /></span>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    population: {
        type: Number,
        required: true,
    },
});
const { population } = toRefs(props);
</script>
