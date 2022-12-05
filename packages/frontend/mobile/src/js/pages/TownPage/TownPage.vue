<template>
    <div class="h-full">
        <Layout v-if="this.state === 'loading'">
            <template v-slot:header>
                <header>
                    <div
                        class="text-center text-primary text-display-md font-bold mt-16"
                    >
                        <Spinner />
                    </div>
                </header>
            </template>
        </Layout>

        <Layout v-else-if="this.town !== null">
            <template v-slot:header>
                <header>
                    <p
                        v-if="error !== null"
                        class="text-center text-red text-display-lg mb-4"
                    >
                        {{ error }}
                    </p>

                    <div
                        class="bg-G200 text-display-sm font-bold text-center pt-3 pb-2"
                        style="line-height: 1em"
                    >
                        {{ town.addressSimple }}<br />
                        <span v-if="town.name" class="text-sm font-normal">
                            « {{ town.name }} »</span
                        >
                    </div>
                </header>
            </template>
            <template v-slot:scroll>
                <Container>
                    <div
                        class="text-primary font-bold text-display-sm mt-4 mb-2"
                    >
                        Caractéristiques
                    </div>
                    <TownPagePanelCharacteristics :town="town" />
                    <div
                        class="text-primary font-bold text-display-sm mt-8 mb-2"
                    >
                        Habitants
                    </div>
                    <TownPagePanelPeople :town="town" />
                    <div
                        class="text-primary font-bold text-display-sm mt-8 mb-2"
                    >
                        Conditions de vie
                    </div>
                    <TownPagePanelLivingConditions :town="town" />
                    <div
                        class="text-primary font-bold text-display-sm mt-8 mb-2"
                    >
                        Procédures judiciaires
                    </div>
                    <TownPagePanelJudicial :town="town" />
                    <div
                        class="text-primary font-bold text-display-sm mt-8 mb-2"
                    >
                        Intervenants
                    </div>
                    <TownPagePanelActors :town="town" class="mb-3" />
                </Container>
            </template>
            <template v-slot:footer>
                <div
                    class="py-3 bg-orange500 text-white text-center"
                    @click="$refs.comments.show()"
                >
                    <Icon icon="comment" />
                    Journal du site ({{ town.comments.regular.length }}
                    messages)
                </div>
            </template>
        </Layout>

        <TownComments
            ref="comments"
            :town="town"
            v-if="town"
            :openByDefault="$store.state.towns.commentsAreOpen"
            :defaultScroll="$store.state.towns.commentsScroll"
        />
    </div>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import Container from "#src/js/components/Container.vue";
import TownPagePanelCharacteristics from "./TownPagePanelCharacteristics.vue";
import TownPagePanelPeople from "./TownPagePanelPeople.vue";
import TownPagePanelLivingConditions from "./TownPagePanelLivingConditions.vue";
import TownPagePanelActors from "./TownPagePanelActors.vue";
import TownPagePanelJudicial from "./TownPagePanelJudicial.vue";
import TownComments from "./comments/TownComments.vue";
import { Icon, Spinner } from "@resorptionbidonvilles/ui";
import { mapGetters } from "vuex";

export default {
    components: {
        Layout,
        Container,
        TownComments,
        TownPagePanelCharacteristics,
        TownPagePanelPeople,
        TownPagePanelLivingConditions,
        TownPagePanelActors,
        TownPagePanelJudicial,
        Icon,
        Spinner,
    },
    data() {
        return {
            error: null,
        };
    },
    computed: {
        ...mapGetters({
            town: "detailedTown",
            state: "townsState",
        }),
    },
    async mounted() {
        if (this.$store.state.towns.state !== "loaded") {
            await this.$store.dispatch("fetchTowns");
        }
        if (
            this.$store.state.towns.detailedTown &&
            this.$store.state.towns.detailedTown.id ===
                parseInt(this.$route.params.id, 10)
        ) {
            return;
        }

        try {
            this.$store.commit("SET_COMMENTS_ARE_OPEN", false);
            this.$store.commit("SET_COMMENTS_SCROLL", 0);
            this.$store.commit("setDetailedTown", this.$route.params.id);
        } catch (error) {
            this.error = "Erreur: " + error.message;
        }
    },
    methods: {
        async toTownsList() {
            this.$router.push(`/liste-des-sites`);
        },
    },
};
</script>
