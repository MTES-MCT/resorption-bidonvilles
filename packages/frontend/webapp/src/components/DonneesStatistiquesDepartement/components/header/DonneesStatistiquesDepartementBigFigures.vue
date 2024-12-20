<template>
    <section id="donnees" class="pt-6">
        <h1 class="text-lg font-bold mb-2">
            <Icon icon="table-list" /> Situation au
            <span class="text-primary">{{
                formatDate(new Date().getTime() / 1000)
            }}</span>
        </h1>
        <div
            class="bg-G100 border border-G300 rounded py-4 px-6 flex md:flex-row flex-col items-stretch"
        >
            <div class="flex flex-col mb-2 md:mb-0">
                <p class="font-bold w-full">Sites de 10 personnes ou plus</p>
                <div class="flex flex-col xs:flex-row gap-2 xs:space-x-5">
                    <div
                        class="bg-G200 rounded-md p-2 flex flex-col flex-wrap items-center xl:items-start"
                    >
                        <div
                            class="flex flex-row flex-wrap items-end justify-center"
                        >
                            <div class="flex flex-row items-center">
                                <img
                                    :src="flagEU"
                                    class="w-9 h-6 mr-1 ml-0"
                                    alt=""
                                />
                                <span
                                    class="text-3xl font-bold align-baseline leading-none"
                                >
                                    {{
                                        formatStat(
                                            metrics.summary.number_of_persons
                                                .eu_only
                                        )
                                    }}
                                </span>
                            </div>
                            <p class="text-sm ml-1 mr-0">
                                habitant<template
                                    v-if="
                                        metrics.summary.number_of_persons
                                            .eu_only > 1
                                    "
                                    >s</template
                                >
                            </p>
                        </div>
                        <p class="font-normal text-sm text-center">
                            exclusivement européens
                        </p>
                    </div>
                    <div
                        class="bg-G200 rounded-md px-2 flex flex-row items-center justify-center"
                    >
                        <div class="flex flex-row items-end gap-1">
                            <div
                                class="flex flex-row gap-1 items-end align-baseline leading-none"
                            >
                                <i class="fa-solid fa-location-dot text-2xl" />
                                <span
                                    class="font-bold text-3xl align-baseline leading-none"
                                    >{{
                                        formatStat(
                                            metrics.summary.number_of_towns
                                                .eu_only
                                        )
                                    }}</span
                                >
                            </div>
                            <p class="text-sm">
                                site<template
                                    v-if="
                                        metrics.summary.number_of_towns
                                            .eu_only > 1
                                    "
                                    >s</template
                                >
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-px bg-G300 mx-6"></div>
            <div class="flex flex-col mb-2 md:mb-0">
                <p class="font-bold">Tous sites</p>
                <div class="flex flex-col xs:flex-row gap-2 xs:space-x-5">
                    <div
                        class="bg-G200 rounded-md p-2 flex flex-col flex-wrap items-center xl:items-start"
                    >
                        <div
                            class="flex flex-row flex-wrap items-end justify-center"
                        >
                            <div class="flex flex-row items-center gap-1">
                                <i class="fa-solid fa-people-group text-2xl" />
                                <span
                                    class="text-3xl font-bold align-baseline leading-none"
                                >
                                    {{
                                        formatStat(
                                            metrics.summary.number_of_persons
                                                .all
                                        )
                                    }}
                                </span>
                            </div>
                            <p class="text-sm ml-1 mr-0">
                                habitant<template
                                    v-if="
                                        metrics.summary.number_of_persons.all >
                                        1
                                    "
                                    >s</template
                                >
                            </p>
                        </div>
                        <p
                            class="font-normal text-sm text-center xl:text-start"
                        >
                            toutes origines
                        </p>
                    </div>
                    <div
                        class="bg-G200 rounded-md p-2 flex flex-row items-center justify-center"
                    >
                        <div class="flex flex-row items-end gap-1">
                            <div
                                class="flex flex-row gap-1 items-end align-baseline leading-none"
                            >
                                <i class="fa-solid fa-location-dot text-2xl" />
                                <span
                                    class="font-bold text-3xl align-baseline leading-none"
                                    >{{
                                        formatStat(
                                            metrics.summary.number_of_towns.all
                                        )
                                    }}</span
                                >
                            </div>
                            <p class="text-sm">
                                site<template
                                    v-if="
                                        metrics.summary.number_of_towns.all > 1
                                    "
                                    >s</template
                                >
                            </p>
                        </div>
                    </div>
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
                        sans nombre de personnes ou indication de l'origine
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
</template>

<script setup>
import { toRefs } from "vue";
import formatStat from "@/utils/formatStat";
import formatDate from "@common/utils/formatDate";

import { Icon } from "@resorptionbidonvilles/ui";
import flagEU from "@/assets/img/flags/eu.png";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
});
const { metrics } = toRefs(props);
</script>
