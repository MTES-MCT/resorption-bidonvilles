<template>
    <a :href="`/site/${this.shantytown.id}`">
        <header>
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
                >
                    Site à compléter
                </Tag>
            </p>
        </header>

        <main>
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
                <a :href="`/site/${shantytown.id}#newComment`">
                    <span
                        class="text-info underline font-bold hover:no-underline"
                        >{{ shantytown.comments.regular.length }} message{{
                            shantytown.comments.regular.length !== 1 ? "s" : ""
                        }}
                    </span>
                </a>
            </p>
        </main>
        <footer class="mt-5">
            <a :href="`/site/${this.shantytown.id}`">
                <span class="font-bold text-primary hover:underline">
                    Voir la fiche du site <Icon icon="arrow-right" />
                </span>
            </a>
        </footer>
    </a>
</template>

<script>
import getSince from "#app/utils/getSince";
import formatLastUpdatedAt from "#app/utils/formatLastUpdatedAt";
import TownPopulation from "#app/components/TownPopulation/TownPopulation";
import { formatLivingConditions } from "#app/pages/TownDetails/formatLivingConditions";
export default {
    props: {
        shantytown: {
            type: Object,
            required: true
        }
    },
    components: {
        TownPopulation
    },
    computed: {
        pinVariant() {
            const { months } = getSince(this.shantytown.updatedAt);
            return months >= 1 ? "pin_red" : "pin";
        },
        stableConditions() {
            const details = formatLivingConditions(this.shantytown);
            const conditions = [];
            if (
                this.shantytown.accessToWater === true &&
                details.water.negative.length === 0
            ) {
                conditions.push("eau");
            }
            if (
                this.shantytown.accessToSanitary === true &&
                details.sanitary.negative.length === 0
            ) {
                conditions.push("toilettes");
            }
            if (this.shantytown.electricityType.value === true) {
                conditions.push("électricité");
            }
            if (
                this.shantytown.trashEvacuation === true &&
                details.trash.negative.length === 0
            ) {
                conditions.push("évacuation des déchets");
            }
            if (this.shantytown.vermin === false) {
                conditions.push("prévention des nuisibles");
            }
            if (
                this.shantytown.firePreventionMeasures === true &&
                details.firePrevention.negative.length === 0
            ) {
                conditions.push("prévention incendie");
            }
            return conditions;
        }
    },
    methods: {
        formatLastUpdatedAt
    }
};
</script>
