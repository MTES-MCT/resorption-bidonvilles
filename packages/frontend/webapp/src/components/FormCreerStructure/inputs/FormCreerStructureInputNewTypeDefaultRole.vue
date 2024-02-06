<template>
    <CheckableGroup
        id="new_type_default_role"
        info="Tous les utilisateurs rattachés à cette structure auront ce rôle par défaut."
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="new_type_default_role"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config.roles.map((role) => ({
        value: role.id,
        label: role.name,
    }));
});
</script>
