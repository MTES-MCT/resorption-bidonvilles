<template>
    <FilArianne />
    <Title class="mt-6">{{ departement.name }} ({{ departement.code }})</Title>

    <section id="donnees" class="pt-6">
        <h1 class="text-lg font-bold mb-2">
            <Icon icon="table-list" /> Situation au
            <span class="text-primary">{{
                formatDate(new Date().getTime() / 1000)
            }}</span>
        </h1>
        <div
            class="bg-G100 border border-G300 rounded py-4 px-6 flex items-stretch"
        >
            <div class="flex space-x-5 self-center flex-1">
                <p>
                    <span class="font-bold text-3xl">{{
                        metrics.summary.number_of_towns.all
                    }}</span
                    ><br />site<template
                        v-if="metrics.summary.number_of_towns.all > 1"
                        >s</template
                    >
                </p>
                <p>
                    <span class="font-bold text-3xl">{{
                        metrics.summary.number_of_persons.all
                    }}</span
                    ><br />personne<template
                        v-if="metrics.summary.number_of_persons.all > 1"
                        >s</template
                    >
                </p>
            </div>
            <div class="w-px bg-G300 mx-6"></div>
            <div>
                <p>Sites avec exclusivement des ressortissants européens</p>
                <div class="flex space-x-5">
                    <p>
                        <span class="font-bold text-lg">{{
                            metrics.summary.number_of_towns.eu_only
                        }}</span
                        ><br />site<template
                            v-if="metrics.summary.number_of_towns.eu_only > 1"
                            >s</template
                        >
                    </p>
                    <p>
                        <span class="font-bold text-lg">{{
                            metrics.summary.number_of_persons.eu_only
                        }}</span
                        ><br />personne<template
                            v-if="metrics.summary.number_of_persons.eu_only > 1"
                            >s</template
                        >
                    </p>
                </div>
            </div>
            <div class="w-px bg-G300 mx-6"></div>
            <div>
                <div
                    class="flex space-x-2"
                    :class="
                        metrics.summary.number_of_towns.unknown_population > 0
                            ? 'text-error'
                            : 'text-success'
                    "
                >
                    <p>
                        <Icon
                            :icon="
                                metrics.summary.number_of_towns
                                    .unknown_population > 0
                                    ? 'times'
                                    : 'check'
                            "
                        />
                    </p>
                    <p
                        v-if="
                            metrics.summary.number_of_towns.unknown_population >
                            0
                        "
                    >
                        {{ metrics.summary.number_of_towns.unknown_population }}
                        site<template
                            v-if="
                                metrics.summary.number_of_towns
                                    .unknown_population > 1
                            "
                            >s</template
                        >
                        sans nombre de personnes ou indications de l'origine
                    </p>
                    <p v-else>
                        Les nombres et origines des personnes sont renseignées
                        pour tous les sites
                    </p>
                </div>
                <div
                    class="flex space-x-2"
                    :class="
                        metrics.summary.number_of_towns.out_of_date > 0
                            ? 'text-error'
                            : 'text-success'
                    "
                >
                    <p>
                        <Icon
                            :icon="
                                metrics.summary.number_of_towns.out_of_date > 0
                                    ? 'times'
                                    : 'check'
                            "
                        />
                    </p>
                    <p v-if="metrics.summary.number_of_towns.out_of_date > 0">
                        {{ metrics.summary.number_of_towns.out_of_date }}
                        site<template
                            v-if="
                                metrics.summary.number_of_towns.out_of_date > 1
                            "
                            >s</template
                        >
                        sans mise à jour depuis 6 mois ou plus
                    </p>
                    <p v-else>
                        Tous les sites ont été mis à jour dans les 6 derniers
                        mois
                    </p>
                </div>
            </div>
        </div>
    </section>

    <main class="mt-6">
        <Onglets @switch="switchTab" :tabs="tabs" :activeTab="activeTab" />

        <div class="mt-6 flex justify-evenly items-stretch">
            <div class="flex-1 pr-6">
                <SummaryTable
                    v-if="activeTab === 'synthese'"
                    :metrics="metrics"
                />
                <InhabitantsTable
                    v-if="activeTab === 'habitants'"
                    :metrics="metrics"
                />
                <LivingConditionsTable
                    v-if="activeTab === 'conditions_de_vie'"
                    :metrics="metrics"
                />
                <JusticeTable
                    v-if="activeTab === 'juridique'"
                    :metrics="metrics"
                />
            </div>
            <div class="w-1 bg-blue300 relative">
                <div
                    class="absolute top-0 left-0 w-4 -ml-2 z-[3000] text-primary font-bold text-center"
                >
                    <div
                        class="bg-blue300 rounded-t cursor-pointer hover:bg-blue200"
                    >
                        &lt;
                    </div>
                    <div
                        class="bg-blue300 rounded-b cursor-pointer hover:bg-blue200"
                    >
                        &gt;
                    </div>
                </div>
            </div>
            <div class="flex-1 h-128">
                <CartoDonneesStatistiques
                    ref="carte"
                    :isLoading="isLoading"
                    :towns="towns"
                />
            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted, toRefs, ref, watch } from "vue";
import { useGeojsonStore } from "@/stores/geojson.store";
import formatDate from "@common/utils/formatDate";

import { Icon } from "@resorptionbidonvilles/ui";
import FilArianne from "../DonneesStatistiques/FilArianne.vue";
import Title from "../DonneesStatistiques/Title.vue";
import Onglets from "../DonneesStatistiques/DonneesStatistiquesDepartementOnglets.vue";
import CartoDonneesStatistiques from "@/components/CartoDonneesStatistiques/CartoDonneesStatistiques.vue";
import SummaryTable from "./components/tables/SummaryTable.vue";
import InhabitantsTable from "./components/tables/InhabitantsTable.vue";
import LivingConditionsTable from "./components/tables/LivingConditionsTable.vue";
import JusticeTable from "./components/tables/JusticeTable.vue";

const props = defineProps({
    departement: {
        type: Object,
        required: true,
    },
    metrics: {
        type: Object,
        required: true,
    },
});

const tabs = [
    {
        id: "synthese",
        label: "Synthèse",
    },
    {
        id: "habitants",
        label: "Habitants",
    },
    {
        id: "conditions_de_vie",
        label: "Conditions de vie",
    },
    {
        id: "juridique",
        label: "Juridique",
    },
];

const activeTab = ref("synthese");
const { departement, metrics } = toRefs(props);
const carte = ref(null);
const isLoading = ref(true);

const towns = computed(() => {
    return metrics.value.cities
        .map(({ city, towns }) =>
            towns.map((t) => ({
                ...t,
                city,
                departement: metrics.value.departement,
                region: metrics.value.region,
            }))
        )
        .flat();
});

async function loadGeojson() {
    isLoading.value = true;

    const geojsonStore = useGeojsonStore();
    try {
        const geojson = await geojsonStore.getDepartement(
            departement.value.code
        );
        carte.value.setBounds(geojson, {
            color: "#00006D",
            weight: "1",
            fill: true,
            fillColor: "#00006D",
            fillOpacity: 0.05,
        });
    } catch (error) {
        console.error(error);
    }

    isLoading.value = false;
}

function switchTab(value) {
    activeTab.value = value;
}

watch(departement, loadGeojson);
onMounted(loadGeojson);
</script>
