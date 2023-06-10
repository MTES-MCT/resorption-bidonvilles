<template>
    <tr>
        <th class="text-left py-2">
            <div class="flex justify-between">
                <span>Commune</span>
                <span class="text-G600"><Icon icon="chevron-down" /></span>
            </div>
        </th>
        <th
            class="text-right w-20"
            v-for="(col, index) in columns"
            :key="index"
        >
            <Icon class="text-lg text-black" :icon="col.icon" />
            <span class="ml-2 text-G600"><Icon icon="chevron-down" /></span>
        </th>
    </tr>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
});
const { columns } = toRefs(props);
</script>
