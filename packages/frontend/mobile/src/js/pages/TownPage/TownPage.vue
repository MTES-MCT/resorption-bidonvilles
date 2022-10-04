<template>
    <div class="h-full">
        <Layout>
            <template v-slot:header>
                <header>
                    <Container class="flex justify-end">
                        <Button
                            variant="textPrimary"
                            class="text-primary self-end"
                            icon="chevron-left"
                            iconPosition="left"
                            :padding="false"
                            @click="toTownsList"
                        >
                            Retour à la liste des sites
                        </Button>
                    </Container>

                    <div
                        class="bg-G200 text-display-lg font-bold text-center py-3 mt-2"
                    >
                        {{ town.addressSimple }}
                        <span v-if="town.name" class="text-display-sm"
                            ><br />
                            « {{ town.name }} »</span
                        >
                    </div>
                </header>
            </template>
            <template v-slot:scroll>
                <Container>
                    <div
                        class="text-primary font-bold text-display-md mt-4 mb-4"
                    >
                        Caractéristiques
                    </div>
                    <TownPagePanelCharacteristics :town="town" />
                    <div
                        class="text-primary font-bold text-display-md mt-8 mb-4"
                    >
                        Habitants
                    </div>
                    <TownPagePanelPeople :town="town" />
                    <div
                        class="text-primary font-bold text-display-md mt-8 mb-4"
                    >
                        Conditions de vie
                    </div>
                    <TownPagePanelLivingConditions :town="town" />
                    <div
                        class="text-primary font-bold text-display-md mt-8 mb-4"
                    >
                        Procédures judiciaires
                    </div>
                    <TownPagePanelJudicial :town="town" />
                </Container>
            </template>
            <template v-slot:footer>
                <div
                    class="py-3 bg-orange400 text-center"
                    @click="$refs.comments.show()"
                >
                    Voir le journal du site
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
import TownPagePanelCharacteristics from "#src/js/pages/TownPage/TownPagePanelCharacteristics.vue";
import TownPagePanelPeople from "#src/js/pages/TownPage/TownPagePanelPeople.vue";
import TownPagePanelLivingConditions from "#src/js/pages/TownPage/TownPagePanelLivingConditions.vue";

import TownPagePanelJudicial from "./TownPagePanelJudicial.vue";
import TownComments from "./comments/TownComments.vue";
import { Button } from "@resorptionbidonvilles/ui";

import { mapGetters } from "vuex";

export default {
    components: {
        Layout,
        Container,
        TownComments,
        TownPagePanelCharacteristics,
        TownPagePanelPeople,
        TownPagePanelLivingConditions,
        TownPagePanelJudicial,
        Button
    },
    data() {
        return {
            error: null
        };
    },
    computed: {
        ...mapGetters({
            town: "detailedTown",
            state: "townsState"
        })
    },
    async created() {
        // changer en mounted + v-show
        if (this.$store.state.towns.state !== "loaded") {
            await this.$store.dispatch("fetchTowns");
        }
        this.$store.commit("setDetailedTown", this.$route.params.id);
    },
    async mounted() {
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
        } catch (error) {
            this.error = "Erreur: " + error.message;
        }
    },
    methods: {
        async toTownsList() {
            this.$router.push(`/liste-des-sites`);
        }
    }
};
</script>
