<template>
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
                        formatStat(metrics.summary.number_of_towns.all)
                    }}</span
                    ><br />site<template
                        v-if="metrics.summary.number_of_towns.all > 1"
                        >s</template
                    >
                </p>
                <p>
                    <span class="font-bold text-3xl">{{
                        formatStat(metrics.summary.number_of_persons.all)
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
                            formatStat(metrics.summary.number_of_towns.eu_only)
                        }}</span
                        ><br />site<template
                            v-if="metrics.summary.number_of_towns.eu_only > 1"
                            >s</template
                        >
                    </p>
                    <p>
                        <span class="font-bold text-lg">{{
                            formatStat(
                                metrics.summary.number_of_persons.eu_only
                            )
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
                            ? 'text-red700'
                            : 'text-green800'
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
                            ? 'text-red700'
                            : 'text-green800'
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
</template>

<script setup>
import { toRefs } from "vue";
import formatStat from "@/utils/formatStat";
import formatDate from "@common/utils/formatDate";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);
</script>
