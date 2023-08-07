<template>
    <ul v-if="shantytown.livingConditions.version === 2">
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.water.status.status"
            >eau</CarteSiteDetailleeLivingConditionIcon
        >
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.sanitary.status.status"
            >toilettes</CarteSiteDetailleeLivingConditionIcon
        >
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.electricity.status.status"
            >électricité</CarteSiteDetailleeLivingConditionIcon
        >

        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.trash.status.status"
            >évac. des déchets</CarteSiteDetailleeLivingConditionIcon
        >

        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions[verminKey].status.status"
            >{{
                shantytown.livingConditions[verminKey].status.status === "good"
                    ? "abs. de nuisibles"
                    : "pres. de nuisibles"
            }}
        </CarteSiteDetailleeLivingConditionIcon>
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions[fireKey].status.status"
            >prev. incendie</CarteSiteDetailleeLivingConditionIcon
        >
    </ul>
    <div v-else>
        <Tag variant="pin_red"
            >Les conditions de vie évoluent : mettez les à jour !</Tag
        >
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import { Tag } from "@resorptionbidonvilles/ui";
import CarteSiteDetailleeLivingConditionIcon from "./CarteSiteDetailleeLivingConditionIcon.vue";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);

const verminKey = computed(() => {
    return shantytown.value.livingConditions.version === 2
        ? "pest_animals"
        : "vermin";
});
const fireKey = computed(() => {
    return shantytown.value.livingConditions.version === 2
        ? "fire_prevention"
        : "firePrevention";
});
</script>
