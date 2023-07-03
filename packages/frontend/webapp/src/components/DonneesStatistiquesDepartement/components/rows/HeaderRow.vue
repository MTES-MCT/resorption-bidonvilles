<template>
    <tr>
        <th
            @click="changeSort('city_name')"
            class="text-left py-2 cursor-pointer bg-clip-padding bg-white hover:bg-G200"
        >
            <div class="flex justify-between">
                <span>Commune</span>
                <span
                    v-if="
                        departementMetricsStore.sort[
                            departementMetricsStore.activeTab
                        ].id === 'city_name'
                    "
                    class="text-G600"
                    ><Icon :icon="chevronState"
                /></span>
            </div>
        </th>
        <Title
            tag="th"
            :title="col.title"
            @click="changeSort(col.uid)"
            class="text-right w-20 cursor-pointer bg-clip-padding bg-white hover:bg-G200"
            v-for="col in columns"
            :key="col.uid"
        >
            <Icon class="text-lg text-black" :icon="col.icon" />
            <span
                v-if="
                    departementMetricsStore.sort[
                        departementMetricsStore.activeTab
                    ].id === col.uid
                "
                class="ml-2 text-G600"
                ><Icon :icon="chevronState"
            /></span>
        </Title>
        <th class="w-8"></th>
    </tr>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { Icon, Title } from "@resorptionbidonvilles/ui";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
});
const { columns } = toRefs(props);

const departementMetricsStore = useDepartementMetricsStore();

const chevronState = computed(() => {
    return departementMetricsStore.sort[departementMetricsStore.activeTab]
        .order === "asc"
        ? "chevron-up"
        : "chevron-down";
});

function switchOrder(value) {
    if (value === "desc") {
        return "asc";
    }
    return "desc";
}

function changeSort(value) {
    if (value === "origins") {
        return;
    }
    if (
        value !==
        departementMetricsStore.sort[departementMetricsStore.activeTab].id
    ) {
        departementMetricsStore.sort[departementMetricsStore.activeTab] = {
            id: value,
            order: "asc",
        };
    } else {
        departementMetricsStore.sort[departementMetricsStore.activeTab].order =
            switchOrder(
                departementMetricsStore.sort[departementMetricsStore.activeTab]
                    .order
            );
    }
}
</script>
