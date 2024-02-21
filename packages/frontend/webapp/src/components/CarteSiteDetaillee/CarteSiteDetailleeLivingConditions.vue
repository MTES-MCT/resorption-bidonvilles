<template>
    <span class="sr-only">Statut des conditions de vie</span>
    <ul v-if="shantytown.livingConditions.version === 2">
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.water.status.status"
            :audio="
                getLibelleAudio(
                    'water',
                    shantytown.livingConditions.water.status.status
                )
            "
            >eau</CarteSiteDetailleeLivingConditionIcon
        >
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.sanitary.status.status"
            :audio="
                getLibelleAudio(
                    'sanitary',
                    shantytown.livingConditions.sanitary.status.status
                )
            "
            >toilettes</CarteSiteDetailleeLivingConditionIcon
        >
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.electricity.status.status"
            :audio="
                getLibelleAudio(
                    'electricity',
                    shantytown.livingConditions.electricity.status.status
                )
            "
            >électricité</CarteSiteDetailleeLivingConditionIcon
        >

        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions.trash.status.status"
            :audio="
                getLibelleAudio(
                    'trash',
                    shantytown.livingConditions.trash.status.status
                )
            "
            >évac. des déchets</CarteSiteDetailleeLivingConditionIcon
        >

        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions[verminKey].status.status"
            :audio="
                getLibelleAudio(
                    'vermin',
                    shantytown.livingConditions[verminKey].status.status
                )
            "
            >{{
                shantytown.livingConditions[verminKey].status.status === "good"
                    ? "abs. de nuisibles"
                    : "prés. de nuisibles"
            }}
        </CarteSiteDetailleeLivingConditionIcon>
        <CarteSiteDetailleeLivingConditionIcon
            :status="shantytown.livingConditions[fireKey].status.status"
            :audio="
                getLibelleAudio(
                    'firePrevention',
                    shantytown.livingConditions[fireKey].status.status
                )
            "
            >prév. incendie</CarteSiteDetailleeLivingConditionIcon
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
function getLibelleAudio(key, status) {
    const titles = {
        water: "Eau",
        electricity: "Electricité",
        sanitary: "Toilettes",
        trash: "Evacuation des déchets",
        vermin: "",
        firePrevention: "",
    };

    const audio = {
        vermin: {
            good: "Absence de nuisibles",
            bad: "Présence de nuisibles",
            unknown: "Pas d'information sur l'éventuelle présence de nuisibles",
        },
        firePrevention: {
            good: "Plan de prévention incendie existant",
            bad: "Pas de plan de prévention incendie",
            unknown: "Existence d'un plan de prévention incendie inconnue",
        },
        default: {
            good: "Bonnes conditions d'accès",
            bad: "Mauvaises conditions d'accès",
            unknown: "Conditions d'accès inconnues",
            toImprove: "Conditions d'accès à améliorer",
        },
    };
    return Object.prototype.hasOwn(audio, key)
        ? titles[key] + " " + audio[key][status]
        : titles[key] + ", " + audio.default[status];
}
</script>
