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
            v-model="values.electricity_access_types"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useFormValues } from "vee-validate";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import accessTypes from "@common/utils/electricity_access_types";
import labels from "@/components/Common/FormEtFicheSite.labels";

const items = computed(() => {
    return Object.keys(accessTypes).map((id) => ({
        id,
        label: accessTypes[id],
    }));
});

const values = useFormValues();
</script>
