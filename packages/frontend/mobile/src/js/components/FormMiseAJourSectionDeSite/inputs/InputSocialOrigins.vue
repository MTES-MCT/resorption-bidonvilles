<template>
    <CheckableGroup id="social_origins">
        <Checkbox
            v-for="item in items"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            :variant="'checkbox'"
            name="social_origins"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import store from "#src/store/index.js";
import { computed } from "vue";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
const items = computed(() => {
    return store.state.config.configuration.social_origins;
});
</script>
