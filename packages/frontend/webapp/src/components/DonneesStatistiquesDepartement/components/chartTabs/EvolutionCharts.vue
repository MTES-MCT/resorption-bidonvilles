<template>
    <header class="flex flex-col xl:flex-row lg:space-x-4 justify-between">
        <div class="flex space-x-4 items-end">
            <div>
                <p>Du</p>
                <DatepickerInput
                    withoutMargin
                    :maxDate="to"
                    name="from"
                    :disabled="departementMetricsStore.evolution.isLoading"
                />
            </div>
            <div>
                <p>Au</p>
                <DatepickerInput
                    withoutMargin
                    :minDate="from"
                    :maxDate="today"
                    name="to"
                    :disabled="departementMetricsStore.evolution.isLoading"
                />
            </div>

            <Button
                v-if="
                    !departementMetricsStore.evolution.isLoading &&
                    datesAreNotLoaded &&
                    values.from &&
                    values.to
                "
                @click="update"
                >Valider</Button
            >
        </div>
        <div class="hidden xl:block">
            <p>&nbsp;</p>
            <p class="flex space-x-4 items-center">
                <Button
                    variant="primaryOutline"
                    :disabled="departementMetricsStore.evolution.isLoading"
                    @click="setLastYear"
                    >L'année dernière</Button
                >
                <Button
                    variant="primaryOutline"
                    :disabled="departementMetricsStore.evolution.isLoading"
                    @click="setLastMonth"
                    >Le mois dernier</Button
                >
                <Button
                    variant="primaryOutline"
                    :disabled="departementMetricsStore.evolution.isLoading"
                    @click="setLastWeek"
                    >La semaine dernière</Button
                >
            </p>
        </div>
    </header>

    <div
        class="mt-12 text-center text-3xl text-primary"
        v-if="departementMetricsStore.evolution.isLoading"
    >
        <Spinner />
    </div>
    <ViewErrorInline
        class="mt-12"
        v-else-if="departementMetricsStore.evolution.error"
    >
        <template v-slot:title
            >Les données d'évolution n'ont pas pu être chargées</template
        >
        <template v-slot:code>{{
            departementMetricsStore.evolution.error
        }}</template>
    </ViewErrorInline>
    <div class="mt-6" v-else>
        <component :is="currentTabComponent" />
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useForm } from "vee-validate";
import { trackEvent } from "@/helpers/matomo";

import { Button, DatepickerInput, Spinner } from "@resorptionbidonvilles/ui";
import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import EvolutionChartTabSummary from "./EvolutionChartTabSummary.vue";
import EvolutionChartTabInhabitants from "./EvolutionChartTabInhabitants.vue";
import EvolutionChartTabLivingConditionsByInhabitant from "./EvolutionChartTabLivingConditionsByInhabitant.vue";
import EvolutionChartTabLivingConditionsByTown from "./EvolutionChartTabLivingConditionsByTown.vue";
import EvolutionChartTabJustice from "./EvolutionChartTabJustice.vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

const departementMetricsStore = useDepartementMetricsStore();
const tabs = {
    summary: EvolutionChartTabSummary,
    inhabitants: EvolutionChartTabInhabitants,
    livingConditionsByInhabitant: EvolutionChartTabLivingConditionsByInhabitant,
    livingConditionsByTown: EvolutionChartTabLivingConditionsByTown,
    justice: EvolutionChartTabJustice,
};

const currentTabComponent = computed(() => {
    return tabs[departementMetricsStore.activeTab];
});

const today = ref(new Date());

const { values, setFieldValue } = useForm({
    initialValues: {
        from: new Date(departementMetricsStore.evolution.from),
        to: new Date(departementMetricsStore.evolution.to),
    },
});

const datesAreNotLoaded = computed(() => {
    if (
        !departementMetricsStore.evolution.loaded.from ||
        !departementMetricsStore.evolution.loaded.to
    ) {
        return true;
    }

    if (!values.from || !values.to) {
        return false;
    }

    return (
        values.from.toISOString().slice(0, 10) !==
            departementMetricsStore.evolution.loaded.from
                .toISOString()
                .slice(0, 10) ||
        values.to.toISOString().slice(0, 10) !==
            departementMetricsStore.evolution.loaded.to
                .toISOString()
                .slice(0, 10)
    );
});

function setLastYear() {
    const newTo = new Date();
    newTo.setDate(new Date().getDate() - 1);

    const newFrom = new Date();
    newFrom.setDate(new Date().getDate() - 1);
    newFrom.setFullYear(new Date().getFullYear() - 1);

    setFieldValue("from", newFrom);
    setFieldValue("to", newTo);
    trackEvent(
        "Visualisation des données départementales",
        "Changement dates",
        "L'année dernière"
    );
    update();
}

function setLastMonth() {
    const newTo = new Date();
    newTo.setDate(new Date().getDate() - 1);

    const newFrom = new Date();
    newFrom.setDate(new Date().getDate() - 1);
    newFrom.setMonth(new Date().getMonth() - 1);

    setFieldValue("from", newFrom);
    setFieldValue("to", newTo);
    trackEvent(
        "Visualisation des données départementales",
        "Changement dates",
        "Le mois dernier"
    );
    update();
}

function setLastWeek() {
    const newTo = new Date();
    newTo.setDate(new Date().getDate() - 1);

    const newFrom = new Date();
    newFrom.setDate(new Date().getDate() - 8);

    setFieldValue("from", newFrom);
    setFieldValue("to", newTo);
    trackEvent(
        "Visualisation des données départementales",
        "Changement dates",
        "La semaine dernière"
    );
    update();
}

function update() {
    departementMetricsStore.evolution.from = values.from;
    departementMetricsStore.evolution.to = values.to;
    trackEvent(
        "Visualisation des données départementales",
        "Changement dates",
        `${values.from.toLocaleDateString()} - ${values.to.toLocaleDateString()}`
    );
    departementMetricsStore.fetchEvolution(departementMetricsStore.departement);
}
</script>
