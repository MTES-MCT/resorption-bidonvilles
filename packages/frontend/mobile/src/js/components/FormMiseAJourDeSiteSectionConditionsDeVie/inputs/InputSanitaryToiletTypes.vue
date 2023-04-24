<template>
    <CheckableGroup
        id="sanitary_toilet_types"
        :info="labels.sanitary_toilet_types"
        withoutMargin
    >
        <Checkbox
            v-for="item in items"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            variant="checkbox"
            name="sanitary_toilet_types"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import toiletTypes from "#frontend/common/utils/toilet_types";
import labels from "#src/js/pages/MiseAjourSectionDeSite/MiseAJourSectionDeSite.labels";

const items = computed(() => {
    return Object.keys(toiletTypes).map((id) => ({
        id,
        label: toiletTypes[id],
    }));
});
</script>
