<template>
    <section>
        <article
            class="rounded border py-2 hover:border-primary bg-white"
            :class="{
                'ml-4 mr-4': variant === 'secondary',
                'ml-10 mr-8': variant === 'tertiary',
            }"
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
                            :icon="showChildren ? 'chevron-up' : 'chevron-down'"
                            class="cursor-pointer"
                            @click="toggle"
                            :class="
                                metrics.children?.length > 0 ? '' : 'invisible'
                            "
                    /></span>
                    <span class="mr-2"
                        ><CheckboxUi
                            variant="checkbox"
                            name="metrics-selection"
                            :value="`${metrics.level}-${metrics.code}-${metrics.uid}`"
                            v-model="metricsStore.selection"
                    /></span>
                    <span class="mr-3"
                        ><Icon
                            class="text-primary cursor-pointer"
                            icon="fa-star fa-regular"
                    /></span>
                    {{ metrics.name }}</GrilleCelluleHeader
                >
                <GrilleCellule
                    ><Icon icon="handshake-angle" />
                    {{ metrics.metrics.number_of_actors.to }}</GrilleCellule
                >
                <GrilleCellule
                    ><Icon icon="faucet-drip" />
                    {{ metrics.metrics.number_of_towns_with_water.to }} ({{
                        metrics.metrics.number_of_persons_with_water.to
                    }})</GrilleCellule
                >
                <GrilleCellule
                    ><Icon icon="earth-europe" />
                    {{ metrics.metrics.number_of_towns_with_eu_only.to }}
                    ({{
                        Math.round(
                            (metrics.metrics.number_of_towns_with_eu_only.to /
                                metrics.metrics.number_of_towns.to) *
                                100
                        )
                    }}%)</GrilleCellule
                >
                <GrilleCelluleEvolution>{{
                    metrics.metrics.number_of_persons.to
                }}</GrilleCelluleEvolution>
                <GrilleCelluleEvolution :separator="false">{{
                    metrics.metrics.number_of_towns.to
                }}</GrilleCelluleEvolution>
            </div>
        </article>

        <div
            class="bg-G100"
            :class="variant === 'primary' ? 'py-3' : ''"
            v-if="metrics.children?.length > 0 && showChildren"
        >
            <GrilleLigne
                v-for="m in metrics.children"
                :key="`${m.level}-${m.code}`"
                class="mt-2"
                :metrics="m"
                :variant="variant === 'primary' ? 'secondary' : 'tertiary'"
            />
        </div>
    </section>
</template>

<style scoped lang="scss" src="./grid.scss" />

<script setup>
import { ref, toRefs } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";

import GrilleCellule from "./GrilleCellule.vue";
import GrilleCelluleHeader from "./GrilleCelluleHeader.vue";
import GrilleCelluleEvolution from "./GrilleCelluleEvolution.vue";
import { CheckboxUi, Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
    variant: {
        type: String,
        default: "primary",
    },
});
const { metrics, variant } = toRefs(props);

const showChildren = ref(false);
const metricsStore = useMetricsStore();

function toggle() {
    showChildren.value = !showChildren.value;
}
</script>
