<template>
    <section>
        <component
            :is="linkTo ? 'router-link' : 'article'"
            v-bind="linkTo ? { to: linkTo } : {}"
            class="grille-row cursor-pointer block py-2 bg-white"
            :class="{
                'grille-row--secondary': variant === 'secondary',
                'grille-row--tertiary': variant === 'tertiary',
            }"
            @click="toggle"
        >
            <div
                class="grid text-right"
                :class="
                    variant === 'primary'
                        ? 'grid-template'
                        : `grid-template-${variant}`
                "
            >
                <GrilleCelluleHeader
                    :separator="false"
                    :pl="
                        variant === 'primary'
                            ? 4
                            : variant === 'secondary'
                            ? 0
                            : 2
                    "
                >
                    <span class="mr-4" v-if="variant !== 'tertiary'"
                        ><Icon
                            :icon="collapsed ? 'chevron-right' : 'chevron-down'"
                            class="cursor-pointer"
                            :class="
                                metrics.children?.length > 0 ? '' : 'invisible'
                            "
                    /></span>
                    {{ metrics.name }}</GrilleCelluleHeader
                >
                <GrilleCelluleEvolution>
                    <template v-slot:evolution>
                        <div
                            class="flex h-6 w-full items-center justify-center"
                            :class="townsWithWaterEvolutionColor"
                        >
                            <Icon
                                :class="townsWithWaterEvolutionIconRotation"
                                icon="arrow-alt-circle-right"
                            />
                            &nbsp;
                            {{ townsWithWaterEvolutionWording }}
                        </div>
                    </template>
                    <template v-slot:figure>
                        <div class="text-center">
                            <div>
                                {{ formatStat(townsWithWaterTo) }}
                                ({{ townsWithWaterPercentage }}%)
                            </div>
                            <span class="block text-sm">
                                <Icon icon="user" class="mr-1" />
                                {{ formatStat(personsWithWaterTo) }}
                                ({{ personsWithWaterPercentage }}%)
                            </span>
                        </div>
                    </template>
                </GrilleCelluleEvolution>
                <GrilleCelluleEvolution>
                    <template v-slot:evolution>
                        <div
                            class="flex h-6 w-full items-center justify-center"
                            :class="populationEvolutionColor"
                        >
                            <Icon
                                :class="populationEvolutionIconRotation"
                                icon="arrow-alt-circle-right"
                            />
                            &nbsp;
                            {{ populationEvolutionWording }}
                        </div>
                    </template>
                    <template v-slot:figure>
                        {{ formatStat(metrics.metrics.number_of_persons.to) }}
                    </template>
                </GrilleCelluleEvolution>
                <GrilleCelluleEvolution :separator="false">
                    <template v-slot:evolution>
                        <div
                            class="flex h-6 w-full items-center justify-center"
                            :class="townEvolutionColor"
                        >
                            <Icon
                                :class="townEvolutionIconRotation"
                                icon="arrow-alt-circle-right"
                            />
                            &nbsp;
                            {{ townEvolutionWording }}
                        </div>
                    </template>

                    <template v-slot:figure>
                        {{ formatStat(metrics.metrics.number_of_towns.to) }}
                    </template>
                </GrilleCelluleEvolution>
            </div>
        </component>

        <div
            class="bg-G100"
            :class="variant === 'primary' ? 'py-3' : ''"
            v-if="metrics.children?.length > 0 && !collapsed"
        >
            <GrilleLigne
                v-for="m in metrics.children"
                :key="m.uid"
                class="mt-2"
                :metrics="m"
                :variant="variant === 'primary' ? 'secondary' : 'tertiary'"
                :collapseByDefault="collapseByDefault"
            />
        </div>
    </section>
</template>

<style scoped lang="scss" src="./grid.scss" />

<script setup>
import { computed, toRefs } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";
import formatStat from "@common/utils/formatStat";

import GrilleCelluleHeader from "./GrilleCelluleHeader.vue";
import GrilleCelluleEvolution from "./GrilleCelluleEvolution.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
    variant: {
        type: String,
        default: "primary",
    },
    collapseByDefault: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { metrics, variant, collapseByDefault } = toRefs(props);

const metricsStore = useMetricsStore();
const collapsed = computed(() => {
    const { uid, level } = metrics.value;
    return (
        metricsStore.collapsedStatuses[`${level}-${uid}`] ??
        collapseByDefault.value
    );
});

const linkTo = computed(() => {
    if (metrics.value.level === "departement") {
        return `/visualisation-donnees/departement/${metrics.value.uid}#donnees`;
    }

    return null;
});

function toggle() {
    const { uid, level } = metrics.value;
    metricsStore.collapsedStatuses[`${level}-${uid}`] = !collapsed.value;
}

// on setup l'affichage des variations de population
const populationEvolution = computed(() => {
    if (metrics.value.metrics.number_of_persons.from === 0) {
        return null;
    }
    return Math.round(
        ((metrics.value.metrics.number_of_persons.to -
            metrics.value.metrics.number_of_persons.from) *
            100) /
            metrics.value.metrics.number_of_persons.from
    );
});

const populationEvolutionWording = computed(() => {
    if (populationEvolution.value === null) {
        return "-";
    }

    return `${populationEvolution.value >= 0 ? "+" : "-"}${Math.abs(
        populationEvolution.value
    )}%`;
});

const populationEvolutionColor = computed(() => {
    if (populationEvolution.value === null || populationEvolution.value === 0) {
        return "bg-G200";
    } else if (populationEvolution.value > 0) {
        return "bg-red200 text-red700";
    } else {
        return "bg-green200 text-green700";
    }
});

const populationEvolutionIconRotation = computed(() => {
    if (populationEvolution.value === null || populationEvolution.value === 0) {
        return "";
    } else if (populationEvolution.value > 0) {
        return "up";
    } else {
        return "down";
    }
});

function readWaterMetric(metric, period) {
    if (typeof metric === "number") {
        return period === "to" ? metric : 0;
    }

    const value = metric?.[period];
    return typeof value === "number" ? value : 0;
}

const townsWithWaterTo = computed(() =>
    readWaterMetric(metrics.value.metrics.number_of_towns_with_water, "to")
);
const townsWithWaterFrom = computed(() =>
    readWaterMetric(metrics.value.metrics.number_of_towns_with_water, "from")
);
const personsWithWaterTo = computed(() =>
    readWaterMetric(metrics.value.metrics.number_of_persons_with_water, "to")
);

const townsWithWaterPercentage = computed(() => {
    const townsCount = metrics.value.metrics.number_of_towns.to;
    if (!townsCount) {
        return 0;
    }

    return Math.round((townsWithWaterTo.value * 100) / townsCount);
});

const personsWithWaterPercentage = computed(() => {
    const personsCount = metrics.value.metrics.number_of_persons.to;
    if (!personsCount) {
        return 0;
    }

    return Math.round((personsWithWaterTo.value * 100) / personsCount);
});

const townsWithWaterEvolution = computed(() => {
    const from = townsWithWaterFrom.value;
    if (from <= 0) {
        return null;
    }

    const to = townsWithWaterTo.value;
    return Math.round(((to - from) * 100) / from);
});

const townsWithWaterEvolutionWording = computed(() => {
    if (townsWithWaterEvolution.value === null) {
        return "-";
    }

    return `${townsWithWaterEvolution.value >= 0 ? "+" : "-"}${Math.abs(
        townsWithWaterEvolution.value
    )}%`;
});

const townsWithWaterEvolutionColor = computed(() => {
    if (
        townsWithWaterEvolution.value === null ||
        townsWithWaterEvolution.value === 0
    ) {
        return "bg-G200";
    }

    return townsWithWaterEvolution.value > 0
        ? "bg-red200 text-red700"
        : "bg-green200 text-green700";
});

const townsWithWaterEvolutionIconRotation = computed(() => {
    if (
        townsWithWaterEvolution.value === null ||
        townsWithWaterEvolution.value === 0
    ) {
        return "";
    }

    return townsWithWaterEvolution.value > 0 ? "up" : "down";
});

// on setup l'affichage des variations de nombre de sites

const townEvolution = computed(() => {
    if (metrics.value.metrics.number_of_towns.from === 0) {
        return null;
    }
    return Math.round(
        ((metrics.value.metrics.number_of_towns.to -
            metrics.value.metrics.number_of_towns.from) *
            100) /
            metrics.value.metrics.number_of_towns.from
    );
});

const townEvolutionWording = computed(() => {
    if (townEvolution.value === null) {
        return "-";
    }

    return `${townEvolution.value >= 0 ? "+" : "-"}${Math.abs(
        townEvolution.value
    )}%`;
});

const townEvolutionColor = computed(() => {
    if (townEvolution.value === null || townEvolution.value === 0) {
        return "bg-G200";
    } else if (townEvolution.value > 0) {
        return "bg-red200 text-red700";
    } else {
        return "bg-green200 text-green700";
    }
});

const townEvolutionIconRotation = computed(() => {
    if (townEvolution.value === null || townEvolution.value === 0) {
        return "";
    } else if (townEvolution.value > 0) {
        return "up";
    } else {
        return "down";
    }
});
</script>

<style scoped>
.grille-row {
    position: relative;
    border-radius: 0.25rem;
}

.grille-row .grid > * {
    box-sizing: border-box;
}

.grille-row::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid #d6d6d6;
    border-radius: 0.25rem;
    pointer-events: none;
}

.grille-row:hover::before {
    border-color: #000091;
}

.grille-row--secondary::before {
    left: 1rem;
    right: 1rem;
}

.grille-row--secondary .grid > :first-child {
    padding-left: 1rem;
}

.grille-row--secondary .grid > :last-child {
    padding-right: 1rem;
}

.grille-row--tertiary::before {
    left: 2rem;
    right: 2rem;
}

.grille-row--tertiary .grid > :first-child {
    padding-left: 2rem;
}

.grille-row--tertiary .grid > :last-child {
    padding-right: 2rem;
}

.down {
    transform: rotate(45deg);
}
.up {
    transform: rotate(-45deg);
}
</style>
