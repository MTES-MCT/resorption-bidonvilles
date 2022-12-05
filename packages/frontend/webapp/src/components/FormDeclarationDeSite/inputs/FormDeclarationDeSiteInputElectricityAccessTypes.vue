<template>
    <CheckableGroup
        id="electricity_access_types"
        :info="labels.electricity_access_types"
    >
        <Checkbox
            v-for="item in items"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            name="electricity_access_types"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import accessTypes from "@/utils/electricity_access_types";
import labels from "../FormDeclarationDeSite.labels";

const items = computed(() => {
    return Object.keys(accessTypes).map((id) => ({
        id,
        label: accessTypes[id],
    }));
});
</script>
