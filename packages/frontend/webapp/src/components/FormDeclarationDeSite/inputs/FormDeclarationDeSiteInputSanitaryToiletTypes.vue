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
            name="sanitary_toilet_types"
            v-bind="$attrs"
            v-model="values.sanitary_toilet_types"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useFormValues } from "vee-validate";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import toiletTypes from "@common/utils/toilet_types";
import labels from "@/components/Common/FormEtFicheSite.labels";

const items = computed(() => {
    return Object.keys(toiletTypes).map((id) => ({
        id,
        label: toiletTypes[id],
    }));
});

const values = useFormValues();
</script>
