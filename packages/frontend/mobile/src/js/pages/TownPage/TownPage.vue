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

        <Layout v-else-if="error !== null">
            <template v-slot:header>
                <header>
                    <p class="text-center text-red text-display-lg mb-4">
                        {{ error }}
                    </p>
                </header>
            </template>
        </Layout>

        <Layout v-else-if="this.town !== null">
            <template v-slot:header>
                <header>
                    <div
                        class="bg-G200 text-display-sm font-bold text-center pt-3 pb-2"
                        style="line-height: 1em"
                    >
                        {{ town.addressSimple }}<br />
                        <span v-if="town.name" class="text-sm font-normal">
                            « {{ town.name }} »</span
                        >
                    </div>

                    <TownPageMenu />
                </header>
            </template>
            <template v-slot:scroll>
                <Container>
                    <TownPagePanelCharacteristics
                        id="caracteristics"
                        :town="town"
                    />

                    <TownPagePanelPeople id="peoples" :town="town" />

                    <TownPagePanelLivingConditions
                        id="living_conditions"
                        :town="town"
                    />

                    <TownPagePanelJudicial id="judicial" :town="town" />

                    <TownPagePanelActors
                        id="actors"
                        :town="town"
                        class="mb-3"
                    />
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
import TownPageMenu from "./TownPageMenu.vue";
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
        TownPageMenu,
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
            town: null,
        };
    },
    computed: {
        ...mapGetters({
            state: "townsState",
        }),
    },
    async mounted() {
        const townId = parseInt(this.$route.params.id, 10);
        if (this.$store.state.towns.state !== "loaded") {
            await this.$store.dispatch("fetchTowns");
        }
        if (this.$store.state.towns.hash[townId]) {
            this.town = this.$store.state.towns.hash[townId];
            return;
        }

        try {
            this.town = await this.$store.dispatch(
                "fetchShantytown",
                this.$route.params.id
            );
            this.$store.commit("SET_COMMENTS_ARE_OPEN", false);
            this.$store.commit("SET_COMMENTS_SCROLL", 0);
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
