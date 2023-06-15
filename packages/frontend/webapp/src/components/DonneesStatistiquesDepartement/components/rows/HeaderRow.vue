<template>
    <tr>
        <th
            class="text-left py-2 cursor-pointer bg-clip-padding bg-white hover:bg-G200"
        >
            <div class="flex justify-between">
                <span>Commune</span>
                <span class="text-G600"><Icon icon="chevron-down" /></span>
            </div>
        </th>
        <Title
            tag="th"
            :title="col.title"
            class="text-right w-20 cursor-pointer bg-clip-padding bg-white hover:bg-G200"
            v-for="col in columns"
            :key="col.uid"
        >
            <Icon class="text-lg text-black" :icon="col.icon" />
            <span class="ml-2 text-G600"><Icon icon="chevron-down" /></span>
        </Title>
    </tr>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon, Title } from "@resorptionbidonvilles/ui";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
});
const { columns } = toRefs(props);
</script>
