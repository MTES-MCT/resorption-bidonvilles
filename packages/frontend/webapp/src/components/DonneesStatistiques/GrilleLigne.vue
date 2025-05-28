<template>
    <section>
        <component
            :is="linkTo ? 'router-link' : 'article'"
            v-bind="linkTo ? { to: linkTo } : {}"
            class="cursor-pointer block rounded border py-2 hover:border-primary bg-white"
            :class="{
                'ml-4 mr-4': variant === 'secondary',
                'ml-10 mr-8': variant === 'tertiary',
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
                <GrilleCellule
                    ><Icon icon="faucet-drip" />
                    {{ formatStat(metrics.metrics.number_of_towns_with_water) }}
                    ({{
                        formatStat(
                            metrics.metrics.number_of_persons_with_water
                        )
                    }})</GrilleCellule
                >
                <GrilleCelluleEvolution>
                    <template v-slot:evolution>
                        <div :class="populationEvolutionColor">
                            <Icon
                                :class="populationEvolutionIconRotation"
                                icon="arrow-alt-circle-right"
                            />
                            {{ populationEvolutionWording }}
                        </div>
                    </template>
                    <template v-slot:figure>
                        {{ formatStat(metrics.metrics.number_of_persons.to) }}
                    </template>
                </GrilleCelluleEvolution>
                <GrilleCelluleEvolution :separator="false">
                    <template v-slot:evolution>
                        <div :class="townEvolutionColor">
                            <Icon
                                :class="townEvolutionIconRotation"
                                icon="arrow-alt-circle-right"
                            />
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
                :key="`${m.level}-${m.code}`"
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

import GrilleCellule from "./GrilleCellule.vue";
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
.down {
    transform: rotate(45deg);
}
.up {
    transform: rotate(-45deg);
}
</style>
