<template>
    <article
        class="border-1 border-blue300 px-4 pb-4 cursor-pointer hover:bg-blue200 flex flex-col"
        @click="routeToDetailsPage"
    >
        <header class="-mt-1">
            <Tag display="inline-block" class="mb-3" :variant="pinVariant">
                {{ formatLastUpdatedAt(shantytown) }}
            </Tag>

            <h1 class="font-bold text-lg">{{ shantytown.usename }}</h1>
            <h2 class="text-lg">{{ shantytown.city.name }}</h2>

            <p class="m-0">
                <TagObjectifResorption
                    class="mt-2"
                    display="inline-block"
                    variant="short"
                    v-if="shantytown.resorptionTarget"
                    :target="shantytown.resorptionTarget"
                />
            </p>
            <p class="m-0" v-if="shantytown.completionRate < 0.8">
                <Tag
                    display="inline-block"
                    variant="highlight"
                    :uppercase="false"
                    class="mt-2"
                >
                    Site à compléter
                </Tag>
            </p>
        </header>

        <main class="mb-4">
            <!-- population -->
            <NombreHabitants
                v-if="
                    shantytown.populationTotal ||
                    shantytown.populationTotal === 0
                "
                class="mt-4 text-lg font-bold"
                :population="shantytown.populationTotal"
            />
            <p class="mt-4" v-else>
                <span class="font-bold">Population :</span> inconnue
            </p>

            <!-- conditions de vie -->
            <ul
                v-if="
                    shantytown.livingConditions.version === 2 &&
                    stableConditions.length > 0
                "
                class="mt-4"
            >
                <li v-for="(condition, index) in stableConditions" :key="index">
                    <span
                        class="inline-block text-xs rounded-full border-2 border-green500 text-green500 mr-1 mb-1"
                        style="padding: 0.2em"
                        ><Icon icon="check"
                    /></span>
                    {{ condition }}
                </li>
            </ul>
            <p v-else class="mt-4 text-red">
                <span class="text-xl align-middle"
                    ><Icon icon="times" class="mr-1"
                /></span>
                <span v-if="shantytown.livingConditions.version === 2"
                    >Urgence à sécuriser les conditions de vie</span
                >
                <span v-else
                    >Les conditions de vie évoluent : mettez les à jour !</span
                >
            </p>

            <!-- journal du site -->
            <p v-if="shantytown.comments.regular.length > 0" class="mt-6">
                <Link :to="`/site/${shantytown.id}#journal_du_site`"
                    >{{ shantytown.comments.regular.length }} message{{
                        shantytown.comments.regular.length !== 1 ? "s" : ""
                    }}
                </Link>
            </p>
        </main>

        <footer class="mt-auto">
            <Link :to="`/site/${shantytown.id}`" @click="routeToDetailsPage"
                >Voir la fiche du site <Icon icon="arrow-right"
            /></Link>
        </footer>
    </article>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import router from "@/helpers/router";
import getSince from "@/utils/getSince";
import formatLastUpdatedAt from "@/utils/formatLastUpdatedAt";
import getStableConditions from "@/utils/getStableConditions";

import { Icon, Link, Tag } from "@resorptionbidonvilles/ui";
import NombreHabitants from "@/components/NombreHabitants/NombreHabitants.vue";
import TagObjectifResorption from "@/components/TagObjectifResorption/TagObjectifResorption.vue";

const props = defineProps({
    shantytown: {
        type: Object,
        required: true,
    },
});
const { shantytown } = toRefs(props);
const stableConditions = getStableConditions(shantytown);
const pinVariant = computed(() => {
    const { months } = getSince(shantytown.value.updatedAt);
    return months >= 3 ? "pin_red" : "pin";
});

function routeToDetailsPage() {
    router.push(`/site/${shantytown.value.id}`);
}
</script>
