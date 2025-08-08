<template>
    <FicheSousRubrique>
        <div class="flex items-center" :class="colorClass">
            <Icon class="mr-1 font-bold" :icon="icon" />
            <div>
                <div class="flex items-center">
                    <div :class="[colorClass, 'font-bold', 'mr-1']">
                        {{ title }}<span v-if="showStatus"> :</span>
                    </div>
                    <div v-if="showStatus">
                        {{ text }}
                    </div>
                </div>
                <slot />
            </div>
        </div>

        <div class="ml-4">
            <div v-if="info">{{ info }}</div>
            <div class="mt-6" v-if="answers.length">
                <div v-for="answer in answers" :key="answer.label" class="mb-2">
                    <span class="font-bold">{{ answer.label }}</span>
                    <p>{{ answer.content }}</p>
                </div>
            </div>
            <div
                v-if="
                    status.negative.length ||
                    status.positive.length ||
                    status.unknown.length
                "
                class="border-1 border-cardBorder rounded px-8 mt-4 hover:bg-G100 cursor-pointer"
                @click="toggleCollapse"
            >
                <div
                    :class="{
                        'border-b-2 border-G200 ': !collapsed,
                    }"
                    class="py-2 font-bold text-primary flex items-center justify-between"
                >
                    <div>
                        <span v-if="status.negative.length">
                            {{ status.negative.length }} action{{
                                status.negative.length > 1 ? "s" : ""
                            }}
                            pour améliorer l'accès
                        </span>
                        <span v-else-if="status.positive.length">
                            {{ status.positive.length }} action{{
                                status.positive.length > 1 ? "s" : ""
                            }}
                            pour entretenir l'accès
                        </span>
                        <span
                            v-if="
                                status.unknown.length &&
                                (status.negative.length ||
                                    status.positive.length)
                            "
                            >et
                        </span>
                        <span v-if="status.unknown.length">
                            {{ status.unknown.length }} information{{
                                status.unknown.length > 1 ? "s" : ""
                            }}
                            non renseignée{{
                                status.unknown.length > 1 ? "s" : ""
                            }}
                        </span>
                    </div>
                    <Button
                        :icon="collapsed ? 'chevron-up' : 'chevron-down'"
                        variant="primaryText"
                        type="button"
                    />
                </div>

                <div v-if="!collapsed">
                    <FicheSiteConditionsDeVieDetails
                        v-if="status.negative.length"
                        type="negative"
                        :details="status.negative"
                    />
                    <FicheSiteConditionsDeVieDetails
                        v-if="status.positive.length"
                        type="positive"
                        :details="status.positive"
                    />
                    <FicheSiteConditionsDeVieDetails
                        v-if="status.unknown.length"
                        type="unknown"
                        :details="status.unknown"
                    />
                </div>
            </div>
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";

import { Button, Icon } from "@resorptionbidonvilles/ui";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import FicheSiteConditionsDeVieDetails from "./FicheSiteConditionsDeVieDetails.vue";

const props = defineProps({
    title: String,
    status: Object,
    info: {
        type: String,
        required: false,
    },
    showStatus: {
        type: Boolean,
        required: false,
        default: true,
    },
    answers: {
        type: Array,
        required: false,
        default: () => [],
    },
    inverted: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { title, status, info, showStatus, answers, inverted } = toRefs(props);
const collapsed = ref(true);

const COLORS = {
    good: "text-tertiaryA11Y",
    toImprove: "text-secondary",
    bad: "text-secondary",
    unknown: "text-secondary",
    activeHeatwave: "text-warning",
    inactiveHeatwave: "text-G700",
};
const ICONS = {
    good: "check",
    toImprove: "exclamation-triangle",
    bad: "times",
    unknown: "question",
    activeHeatwave: "sun",
    inactiveHeatwave: "temperature-half",
};
const TEXTS = {
    good: "oui",
    toImprove: "à améliorer",
    bad: "non",
    unknown: "inconnu",
    activeHeatwave: "activée",
    inactiveHeatwave: "désactivée",
};
const realStatus = computed(() => {
    let s = status.value.status;
    if (inverted.value === true) {
        if (s === "good") {
            s = "bad";
        } else if (s === "bad") {
            s = "good";
        }
    }

    return s;
});
const colorClass = computed(() => {
    return COLORS[realStatus.value] || "text-secondary";
});
const icon = computed(() => {
    return ICONS[realStatus.value] || "question";
});
const text = computed(() => {
    return TEXTS[realStatus.value] || "inconnu";
});

function toggleCollapse() {
    collapsed.value = !collapsed.value;
}
</script>
