<template>
    <Autocomplete
        v-bind="$attrs"
        :fn="autocompleteFn"
        v-model="search"
        showCategory
    />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { autocomplete as autocompleteLocation } from "@/api/locations.api.js";
import { autocomplete as autocompleteUsers } from "@/api/organizations.api.js";

import formatLocationLabel from "@/utils/formatLocationLabel.js";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});

const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const search = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

async function autocompleteFn(value) {
    const locationResults = await autocompleteLocation(value);
    const userResults = await autocompleteUsers(value);

    return restrictLengthByCategory([
        ...locationResults.map((location) => ({
            id: location.code,
            label: formatLocationLabel(location),
            category: location.label,
            data: {
                code: location.code,
                departement: location.departement,
                typeName: location.label,
                typeUid: location.type,
                latitude: location.latitude,
                longitude: location.longitude,
            },
        })),
        ...userResults.map((item) => {
            return {
                ...item,
                category: item.type.label,
                data: {
                    id: item.id,
                    label: item.label,
                    type: item.type.id,
                    organization_id: item.organization,
                },
            };
        }),
    ]);
}

function restrictLengthByCategory(list) {
    // on ne garde que les 3 premières entrées pour chaque catégorie
    const categories = {};
    const a = list.filter((el) => {
        if (!categories[el.category]) {
            categories[el.category] = 1;
            return true;
        } else if (categories[el.category] >= 3) {
            return false;
        } else {
            categories[el.category] += 1;
            return true;
        }
    });
    return a;
}
</script>
