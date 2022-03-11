<template>
    <article
        class="border border-blue300 px-4 pb-4 cursor-pointer hover:bg-blue200 flex flex-col"
        @click="routeToDetailPage"
    >
        <header class="-mt-1">
            <Tag display="inline-block" class="mb-3" :variant="pinVariant">
                {{ formatLastUpdatedAt(shantytown) }}
            </Tag>

            <h1 class="font-bold text-lg">{{ shantytown.usename }}</h1>
            <h2 class="text-lg">{{ shantytown.city.name }}</h2>

            <p class="m-0">
                <Tag
                    variant="info"
                    display="inline-block"
                    class="mt-2"
                    v-if="shantytown.resorptionTarget"
                >
                    Objectif résorption {{ shantytown.resorptionTarget }}
                </Tag>
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
            <TownPopulation
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
            <ul v-if="stableConditions.length > 0" class="mt-4">
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
                Urgence à sécuriser les conditions de vie
            </p>

            <!-- journal du site -->
            <p v-if="shantytown.comments.regular.length > 0" class="mt-6">
                <router-link
                    :to="`/site/${shantytown.id}#newComment`"
                    class="text-info underline font-bold hover:no-underline"
                    @click.native.stop
                    >{{ shantytown.comments.regular.length }} message{{
                        shantytown.comments.regular.length !== 1 ? "s" : ""
                    }}
                </router-link>
            </p>
        </main>

        <footer class="mt-auto">
            <router-link
                :to="`/site/${shantytown.id}`"
                class="font-bold text-primary hover:underline"
                @click.native.stop
                >Voir la fiche du site <Icon icon="arrow-right"
            /></router-link>
        </footer>
    </article>
</template>

<script>
import getSince from "#app/utils/getSince";
import formatLastUpdatedAt from "#app/utils/formatLastUpdatedAt";
import TownPopulation from "#app/components/TownPopulation/TownPopulation";
import { lifeConditionsMixin } from "#app/mixins/lifeConditionsMixin";

export default {
    mixins: [lifeConditionsMixin],
    components: {
        TownPopulation
    },

    computed: {
        pinVariant() {
            const { months } = getSince(this.shantytown.updatedAt);
            return months >= 1 ? "pin_red" : "pin";
        }
    },

    methods: {
        formatLastUpdatedAt,

        routeToDetailPage() {
            this.$router.push(`/site/${this.shantytown.id}`);
        }
    }
};
</script>
