<template>
    <tr>
        <RbTitle
            tag="th"
            class="w-8 bg-white hover:bg-G200 cursor-pointer"
            :title="collapseTitle"
            @click="toggleCollapse"
        >
            <Icon :icon="collapsedIcon" />
        </RbTitle>
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
                    class="text-G700"
                    ><Icon :icon="chevronState"
                /></span>
            </div>
        </th>

        <RbTitle
            tag="th"
            :title="col.title"
            @click="changeSort(col.uid)"
            class="text-right w-16 cursor-pointer bg-clip-padding bg-white hover:bg-G200"
            v-for="(col, index) in columns"
            :key="col.uid"
        >
            <ToolTip
                class="inline-block ml-2 cursor-pointer"
                :tip="col.title"
                :side="index >= columns.length - 2 ? 'right' : 'left'"
                extraStyle="bg-black/80 rounded-md shadow-md text-white text-left py-3 px-3"
            >
                <Icon
                    v-if="!Object.keys(flagMap).includes(col.icon)"
                    class="text-lg text-black"
                    :icon="col.icon"
                />

                <img v-else :src="flagMap[col.icon].icon" class="w-6 ml-auto" />
                <span
                    v-if="
                        departementMetricsStore.sort[
                            departementMetricsStore.activeTab
                        ].id === col.uid
                    "
                    class="ml-2 text-G700"
                    ><Icon :icon="chevronState"
                /></span>
            </ToolTip>
        </RbTitle>
        <th class="w-8 bg-white"></th>
    </tr>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { trackEvent } from "@/helpers/matomo";

import ToolTip from "@resorptionbidonvilles/ui/src/components/ToolTip.vue";
import flagFR from "@/assets/img/flags/fr.png";
import flagEU from "@/assets/img/flags/eu.png";
import flagExtraCommunautaires from "@/assets/img/flags/extra-communautaires.png";

import { Icon, Title as RbTitle } from "@resorptionbidonvilles/ui";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
});
const { columns } = toRefs(props);
console.log("Columns", columns.value);
const flagMap = {
    french: { icon: flagFR },
    european: { icon: flagEU },
    other: { icon: flagExtraCommunautaires },
};

const departementMetricsStore = useDepartementMetricsStore();

const chevronState = computed(() => {
    return departementMetricsStore.sort[departementMetricsStore.activeTab]
        .order === "asc"
        ? "chevron-up"
        : "chevron-down";
});

const globalCollapseStatus = computed(() => {
    const values = Object.values(departementMetricsStore.collapsedCities);
    const isFull =
        values.length === departementMetricsStore.filteredMetrics.cities.length;
    const hasFalse = Object.values(
        departementMetricsStore.collapsedCities
    ).some((city) => city === false);
    const hasTrue =
        Object.values(departementMetricsStore.collapsedCities).some(
            (city) => city === true
        ) || !isFull;

    if (hasFalse && hasTrue) {
        return "mixed";
    }

    return hasFalse ? false : true;
});

const collapseTitle = computed(() => {
    if (["mixed", false].includes(globalCollapseStatus.value)) {
        return "Afficher tout";
    }

    return "Masquer tout";
});

const collapsedIcon = computed(() => {
    if (globalCollapseStatus.value === "mixed") {
        return "minus";
    }

    return globalCollapseStatus.value ? "chevron-down" : "chevron-right";
});

function toggleCollapse() {
    let target = true;
    if (globalCollapseStatus.value === true) {
        target = false;
    }

    departementMetricsStore.filteredMetrics.cities.forEach((data) => {
        departementMetricsStore.collapsedCities[data.city.code] = target;
    });
}

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
    trackEvent(
        "Visualisation des données départementales",
        "Changement de tri",
        value
    );
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
