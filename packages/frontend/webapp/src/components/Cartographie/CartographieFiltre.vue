<template>
    <article class="border-b">
        <LinkButton class="w-full" @click="toggle">
            <span class="inline-flex items-center w-full justify-between">
                <span
                    ><Icon :icon="definition.icon" class="mr-2 w-4" />
                    {{ definition.label }}</span
                >
                <Icon :icon="toggleIcon" />
            </span>
        </LinkButton>
        <main v-show="mapStore.filters[id].opened" class="pb-4 pl-3">
            <DsfrCheckboxSet
                :name="id"
                v-model="selectedValues"
                :options="options"
                small
                @change="$emit('change')"
            />
        </main>
    </article>
</template>

<script setup>
import { defineProps, toRefs, computed, ref, watch } from "vue";
import { useMapStore } from "@/stores/map.store";
import mapFilters from "@/utils/map_filters";

import { Icon, LinkButton } from "@resorptionbidonvilles/ui";

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});
const { id } = toRefs(props);

defineEmits(["change"]);
const definition = mapFilters.value.definition[id.value];
const options = computed(() =>
    definition.options.map((option) => ({
        label: option.label,
        value: option.value,
        id: `${id.value}-${option.value}`,
        name: id.value,
    }))
);

const mapStore = useMapStore();
const selectedValues = ref(mapStore.filters[id.value].checked);

watch(selectedValues, () => {
    mapStore.filters[id.value].checked = selectedValues.value;
});

watch(
    () => mapStore.filters[id.value].checked,
    () => {
        selectedValues.value = mapStore.filters[id.value].checked;
    }
);

const toggleIcon = computed(() => {
    return mapStore.filters[id.value].opened ? "minus" : "plus";
});

function toggle() {
    mapStore.filters[id.value].opened = !mapStore.filters[id.value].opened;
}
</script>
