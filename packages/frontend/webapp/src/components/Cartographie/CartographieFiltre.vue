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
        <main
            v-if="mapStore.filters[id].opened"
            class="pb-4 pl-3 flex flex-col space-y-0"
        >
            <Checkbox
                v-for="option in definition.options"
                :key="option.value"
                :name="id"
                :label="option.label"
                :value="option.value"
                variant="checkbox"
                direction="col"
                @change="$emit('change')"
                small
            />
        </main>
    </article>
</template>

<script setup>
import { defineProps, toRefs, computed, watch } from "vue";
import { useMapStore } from "@/stores/map.store";
import mapFilters from "@/utils/map_filters";
import { useForm } from "vee-validate";

import { Checkbox, Icon, LinkButton } from "@resorptionbidonvilles/ui";

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});
const { id } = toRefs(props);

defineEmits(["change"]);
const definition = mapFilters.value.definition[id.value];
const mapStore = useMapStore();
const { values } = useForm({
    initialValues: {
        [id.value]: mapStore.filters[id.value].checked,
    },
});

watch(values, () => {
    mapStore.filters[id.value].checked = values[id.value];
});

const toggleIcon = computed(() => {
    return mapStore.filters[id.value].opened ? "minus" : "plus";
});

function toggle() {
    mapStore.filters[id.value].opened = !mapStore.filters[id.value].opened;
}
</script>
<style scoped>
.fr-fieldset__element {
    margin-bottom: 0 !important;
}
</style>
