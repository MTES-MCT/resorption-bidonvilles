<template>
    <CheckableGroup
        id="new_type_category"
        info="Les types de structure sont regroupées par catégorie sur la plateforme. Si la catégorie que vous cherchez n'est pas dans la liste, veuillez contacter un administrateur de la plateforme."
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="new_type_category"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";

import itemsFn from "@/utils/organization_categories.js";
const items = itemsFn({ private_organization: true });
</script>
